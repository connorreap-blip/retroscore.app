"use client";

import { useCallback, useEffect, useRef } from "react";

/**
 * Hook for fullscreen mode and screen wake lock (prevent sleep).
 */
export function useFullscreen() {
  const wakeLockRef = useRef<WakeLockSentinel | null>(null);

  const requestFullscreen = useCallback(async () => {
    try {
      await document.documentElement.requestFullscreen();
    } catch {
      // Fullscreen not supported or denied
    }

    // Request wake lock to prevent screen sleep
    try {
      if ("wakeLock" in navigator) {
        wakeLockRef.current = await navigator.wakeLock.request("screen");
      }
    } catch {
      // Wake Lock not supported
    }
  }, []);

  const exitFullscreen = useCallback(async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      }
    } catch {
      // Ignore
    }

    if (wakeLockRef.current) {
      wakeLockRef.current.release();
      wakeLockRef.current = null;
    }
  }, []);

  // Re-acquire wake lock when page becomes visible again
  useEffect(() => {
    const handleVisibility = async () => {
      if (
        document.visibilityState === "visible" &&
        document.fullscreenElement &&
        !wakeLockRef.current
      ) {
        try {
          if ("wakeLock" in navigator) {
            wakeLockRef.current = await navigator.wakeLock.request("screen");
          }
        } catch {
          // Ignore
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

  return { requestFullscreen, exitFullscreen };
}
