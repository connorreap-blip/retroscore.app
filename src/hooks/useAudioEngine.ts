"use client";

import { useRef, useEffect, useCallback, useState } from "react";
import { audioEngine } from "@/lib/audio/audio-engine";

/**
 * Hook to manage audio engine lifecycle.
 * Initializes AudioContext on first user interaction (browser autoplay policy).
 */
export function useAudioEngine() {
  const initializedRef = useRef(false);
  const [isReady, setIsReady] = useState(false);

  const initAudio = useCallback(async () => {
    if (initializedRef.current) return;
    initializedRef.current = true;
    await audioEngine.initialize();
    setIsReady(true);
  }, []);

  useEffect(() => {
    const handler = () => {
      initAudio();
    };

    // Listen for any user interaction to initialize audio
    document.addEventListener("click", handler, { once: true });
    document.addEventListener("touchstart", handler, { once: true });
    document.addEventListener("keydown", handler, { once: true });

    return () => {
      document.removeEventListener("click", handler);
      document.removeEventListener("touchstart", handler);
      document.removeEventListener("keydown", handler);
    };
  }, [initAudio]);

  return { isReady, audioEngine };
}
