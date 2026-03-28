"use client";

import { useRef, useEffect, useState } from "react";
import styles from "@/styles/scoreboard.module.css";

interface NumberPlateProps {
  value?: string | number;
  isEmpty?: boolean;
  isRhe?: boolean;
}

export default function NumberPlate({ value, isEmpty, isRhe }: NumberPlateProps) {
  const prevValue = useRef(value);
  const [animating, setAnimating] = useState(false);
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    if (value !== prevValue.current && !isEmpty) {
      setAnimating(true);
      // After slide-out completes (200ms), swap the value and slide in
      const t1 = setTimeout(() => {
        setDisplayValue(value);
      }, 200);
      // After full animation (400ms), clear the animation state
      const t2 = setTimeout(() => {
        setAnimating(false);
        prevValue.current = value;
      }, 400);
      return () => { clearTimeout(t1); clearTimeout(t2); };
    } else {
      setDisplayValue(value);
      prevValue.current = value;
    }
  }, [value, isEmpty]);

  const cls = [
    styles.plate,
    isEmpty ? styles.emptyPlate : "",
    isRhe ? styles.rhePlate : "",
    animating ? styles.plateSlide : "",
  ]
    .filter(Boolean)
    .join(" ");

  return <div className={cls}>{isEmpty ? "" : displayValue}</div>;
}
