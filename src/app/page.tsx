"use client";

import Noise from "../../Animations/Noise/Noise";
import React, { useState, useRef, useCallback } from "react";

export default function Home() {
  const [scale, setScale] = useState(1);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const ticking = useRef(false);

  // Use requestAnimationFrame to throttle mousemove
  const handleMouseMove = useCallback(() => {
    if (!ticking.current) {
      ticking.current = true;
      window.requestAnimationFrame(() => {
        setScale(5);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
          setScale(1);
        }, 200);
        ticking.current = false;
      });
    }
  }, []);

  // Clean up timeout on unmount
  // (no need to clean ticking, it's just a ref)
  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div
      className="w-full h-screen flex flex-col items-center justify-center bg-black"
      onMouseMove={handleMouseMove}
    >
      <video
        src="/videos/mars.webm"
        autoPlay
        loop
        muted
        playsInline
        className="w-full h-full object-cover"
      />
      <Noise
        patternSize={250}
        patternScaleX={scale}
        patternScaleY={scale}
        patternRefreshInterval={2}
        patternAlpha={15}
      />
    </div>
  );
}