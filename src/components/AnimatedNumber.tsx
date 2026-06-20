import React, { useMemo } from "react";
import { useCountUp } from "../hooks/useCountUp";
import { formatIndoNumber, formatIndoPrecise } from "./KPICards";

interface AnimatedNumberProps {
  value: number;
  isDecimal?: boolean;
}

export function AnimatedNumber({ value, isDecimal = false }: AnimatedNumberProps) {
  // Use a longer duration for "institutional" slow reveal feel
  const count = useCountUp(value, 1500);

  const displayValue = useMemo(() => {
    if (isDecimal) {
      if (count === value) {
        return formatIndoPrecise(value);
      }
      return formatIndoPrecise(count);
    }
    
    if (count === value) {
      return formatIndoNumber(value);
    }
    return formatIndoNumber(count);
  }, [count, value, isDecimal]);

  return <span>{displayValue}</span>;
}
