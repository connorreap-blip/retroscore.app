"use client";

import { useEffect, useRef, useState } from "react";
import styles from "@/styles/scoreboard.module.css";

interface ViewToggleProps {
  activeView: string;
  onSwitch: (view: string) => void;
  views: string[];
  labels: string[];
  cycleMs?: number;
}

export default function ViewToggle({
  activeView,
  onSwitch,
  views,
  labels,
  cycleMs = 600000,
}: ViewToggleProps) {
  const cycleStart = useRef<number>(Date.now());
  const rafRef = useRef<number | null>(null);
  const [fillPct, setFillPct] = useState(0);

  useEffect(() => {
    cycleStart.current = Date.now();

    function tick() {
      const elapsed = Date.now() - cycleStart.current;
      const pct = Math.min((elapsed / cycleMs) * 100, 100);
      setFillPct(pct);

      if (pct >= 100) {
        const currentIndex = views.indexOf(activeView);
        const nextIndex = (currentIndex + 1) % views.length;
        onSwitch(views[nextIndex]);
        cycleStart.current = Date.now();
      }

      rafRef.current = requestAnimationFrame(tick);
    }

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [activeView, cycleMs, onSwitch, views]);

  function handleClick(view: string) {
    onSwitch(view);
    cycleStart.current = Date.now();
  }

  return (
    <>
      <div className={styles.viewToggle}>
        {views.map((view, i) => (
          <button
            key={view}
            className={`${styles.toggleBtn} ${activeView === view ? styles.toggleBtnActive : ""}`}
            onClick={() => handleClick(view)}
          >
            {labels[i]}
          </button>
        ))}
      </div>
      <div className={styles.cycleBar}>
        <div className={styles.cycleTrack}>
          <div
            className={styles.cycleFill}
            style={{ width: `${fillPct}%` }}
          />
        </div>
      </div>
    </>
  );
}
