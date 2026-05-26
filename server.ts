import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = parseInt(process.env.PORT || "3000", 10);

  // JSON parsing middleware
  app.use(express.json());

  // Google Sheets Proxy API Endpoint
  app.get("/api/sync", async (req, res) => {
    const sheetUrl = req.query.url as string;
    if (!sheetUrl) {
      return res.status(400).json({ error: "Missing 'url' query parameter" });
    }

    try {
      // Map Google Sheets sharing URL to CSV export link or visualization query link
      const getCSVExportUrl = (url: string, useGviz: boolean = false): string => {
        const trimmed = url.trim();
        if (!trimmed.includes("docs.google.com/spreadsheets")) {
          return trimmed;
        }
        const matches = trimmed.match(/\/d\/([a-zA-Z0-9-_]+)/);
        if (matches && matches[1]) {
          const spreadsheetId = matches[1];
          const gidMatch = trimmed.match(/[#&]gid=([0-9]+)/);
          const gidParam = gidMatch ? `&gid=${gidMatch[1]}` : "";
          
          if (useGviz) {
            return `https://docs.google.com/spreadsheets/d/${spreadsheetId}/gviz/tq?tqx=out:csv&sheet=final`;
          }
          return `https://docs.google.com/spreadsheets/d/${spreadsheetId}/export?format=csv${gidParam}`;
        }
        return trimmed;
      };

      let text = "";
      let success = false;
      let lastError = "";

      // Strategy 1: Visualization API (Supports 'sheet' name querying)
      try {
        const primaryUrl = getCSVExportUrl(sheetUrl, true);
        const response = await fetch(primaryUrl);
        if (response.ok) {
          text = await response.text();
          success = true;
        } else {
          lastError = `Visualization API HTTP ${response.status}`;
        }
      } catch (e: any) {
        lastError = `Visualization API error: ${e?.message || String(e)}`;
      }

      // Strategy 2: Direct Export Link (Fallback)
      if (!success) {
        try {
          const fallbackUrl = getCSVExportUrl(sheetUrl, false);
          const response = await fetch(fallbackUrl);
          if (response.ok) {
            text = await response.text();
            success = true;
          } else {
            lastError = `Export Link HTTP ${response.status}`;
          }
        } catch (e: any) {
          lastError = `Fallback error: ${e?.message || String(e)}`;
        }
      }

      if (!success) {
        return res.status(400).json({ error: `Failed to download sheet: ${lastError}` });
      }

      // Set headers to transmit raw CSV securely
      res.setHeader("Content-Type", "text/csv; charset=utf-8");
      return res.send(text);

    } catch (e: any) {
      console.error("Backend proxy sheet error:", e);
      return res.status(500).json({ error: "Internal Server Error fetching spreadsheet data" });
    }
  });

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", message: "Google Sheets Sync Backend is running" });
  });

  // Serve Vite in development / static files in production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is booted and listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
});
