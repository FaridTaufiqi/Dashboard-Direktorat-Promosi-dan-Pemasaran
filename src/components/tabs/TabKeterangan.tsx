import React from "react";
import { FileText, CheckCircle2 } from "lucide-react";

export default function TabKeterangan() {
  return (
    <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm space-y-6">
      <div>
        <h2 className="text-lg font-black text-[#0c4a9f] uppercase tracking-tight leading-none mb-1">
          KETERANGAN METODOLOGI & PERATURAN TERKAIT
        </h2>
        <p className="text-xs text-slate-400 font-bold uppercase">
          Daftar singkatan istilah, rujukan undang-undang, dan formulas indeks
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 leading-relaxed">
        {/* Metodologi formulas */}
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-150">
          <h4 className="text-xs font-black text-slate-700 uppercase mb-3 flex items-center gap-1.5 border-b border-slate-200 pb-2">
            <FileText className="w-4 h-4 text-blue-600" />
            Kamus Glosarium Istilah
          </h4>
          <ul className="space-y-3.5 text-xs text-slate-650">
            <li>
              <strong>Indeks Desa (ID)</strong>: Komposit dari Indeks Ketahanan Sosial, Indeks
              Ketahanan Ekonomi, dan Indeks Ketahanan Ekologi. Rentang skoring bernilai 0 hingga
              1.
            </li>
            <li>
              <strong>BUM Desa</strong>: Badan Usaha Milik Desa yang didirikan by pemerintah desa
              untuk mendayagunakan aset bersama dan menggerakkan sirkulasi keuangan lokal
              masyarakat.
            </li>
            <li>
              <strong>BUMDesma (BUM Desa Bersama)</strong>: Struktur kerja sama korporasi antara
              beberapa desa dalam satu kecamatan yang terikat kesepakatan kawasan.
            </li>
            <li>
              <strong>PADes (Pendapatan Asli Desa)</strong>: Kas milik desa yang didanai secara
              mandiri melalui bagi hasil usaha, retribusi pasar, swadaya, dan aset otonom
              lainnya.
            </li>
          </ul>
        </div>

        {/* Perundang-undangan hukum rujukan */}
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-150">
          <h4 className="text-xs font-black text-slate-700 uppercase mb-3 flex items-center gap-1.5 border-b border-slate-200 pb-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            Fasilitas Regulasi Hukum Rujukan
          </h4>
          <ul className="space-y-3.5 text-xs text-slate-650">
            <li>
              <strong>Undang-Undang No. 6 Tahun 2014 tentang Desa</strong>: Landasan konstitusi
              utama otonomi desa dan penyaluran pos alokasi Dana Desa tahunan dari APBN.
            </li>
            <li>
              <strong>Peraturan Pemerintah (PP) No. 11 Tahun 21 tentang BUM Desa</strong>:
              Regulasi pelaksana UU Cipta Kerja yang menetapkan BUM Desa sebagai Badan Hukum
              mandiri.
            </li>
            <li>
              <strong>Peraturan Menteri Desa (Permendesa PDTT) No. 3 Tahun 2021</strong>: Pedoman
              pengelolaan operasional, pembinaan organisasi, and audit akuntabilitas keuangan BUM
              Desa.
            </li>
            <li>
              <strong>Program MBG 2025/2026</strong>: Arahan Kementerian Pertanian & Kemendesa
              untuk melibatkan rantai sirkular pasok pertanian desa dalam program nutrisi gizi
              gratis nasional.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
