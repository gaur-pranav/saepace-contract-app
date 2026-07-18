"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export function HeroPixelWaves() {
  const [dimensions, setDimensions] = useState({ width: 1200, height: 800 });

  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const W = dimensions.width;
  const H = dimensions.height;
  const cx = W / 2;
  const cy = H / 2;

  // 45vw and 55vw boundaries
  const leftEnd = W * 0.45;
  const rightStart = W * 0.55;

  // Left stepped path generator (starts at X=0, converges to leftEnd, cy)
  const getLeftSteppedPath = (startY: number, amp: number, phase: number) => {
    const stepSize = 16;
    let path = `M 0,${startY}`;
    const dx = leftEnd;
    const dy = cy - startY;

    for (let x = 0; x <= leftEnd; x += stepSize) {
      const progress = x / dx;
      // Dampens the wave amplitude to 0 as it converges at leftEnd
      const waveY = Math.sin(progress * Math.PI * 4 + phase) * amp * (1 - progress);
      const roundedY = Math.round((startY + dy * progress + waveY) / 8) * 8;
      path += ` H ${x} V ${roundedY}`;
    }
    path += ` H ${leftEnd} V ${cy}`;
    return path;
  };

  // Right stepped path generator (starts at rightStart, cy, goes to screen edge W)
  const getRightSteppedPath = (amp: number) => {
    const stepSize = 16;
    let path = `M ${rightStart},${cy}`;
    const dx = W - rightStart;

    for (let x = rightStart; x <= W; x += stepSize) {
      const progress = (x - rightStart) / dx;
      const waveY = Math.sin(progress * Math.PI * 5) * amp * Math.sin(progress * Math.PI / 2);
      const roundedY = Math.round((cy + waveY) / 8) * 8;
      path += ` H ${x} V ${roundedY}`;
    }
    path += ` H ${W} V ${cy}`;
    return path;
  };

  const leftPaths = [
    {
      id: "left-slate",
      d: getLeftSteppedPath(cy - cy * 0.4, 45, 0),
      stroke: "#475569", // Slate Blue
    },
    {
      id: "left-teal",
      d: getLeftSteppedPath(cy, 35, Math.PI / 2),
      stroke: "#0D9488", // Dark Teal
    },
    {
      id: "left-cyan",
      d: getLeftSteppedPath(cy + cy * 0.4, 45, Math.PI),
      stroke: "#06B6D4", // Cyan
    },
  ];

  const rightPath = getRightSteppedPath(60);

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-hidden bg-[#030303]">
      <svg
        className="w-full h-full"
        style={{ shapeRendering: "crispEdges" }}
        fill="none"
      >
        <defs>
          {/* Subtle horizontal gradient fading for left paths */}
          <linearGradient id="fade-left-slate" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#475569" stopOpacity="0.0" />
            <stop offset="80%" stopColor="#475569" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#475569" stopOpacity="1.0" />
          </linearGradient>
          <linearGradient id="fade-left-teal" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#0D9488" stopOpacity="0.0" />
            <stop offset="80%" stopColor="#0D9488" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#0D9488" stopOpacity="1.0" />
          </linearGradient>
          <linearGradient id="fade-left-cyan" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.0" />
            <stop offset="80%" stopColor="#06B6D4" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#06B6D4" stopOpacity="1.0" />
          </linearGradient>

          {/* Right Gradient (Violet to transparent at screen edge) */}
          <linearGradient id="fade-right-violet" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#8B5CF6" stopOpacity="1.0" />
            <stop offset="70%" stopColor="#8B5CF6" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.0" />
          </linearGradient>

          {/* Strong neon violet drop-shadow cyber-glow */}
          <filter id="violet-glow" x="-10%" y="-10%" width="120%" height="120%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feComponentTransfer in="blur" result="boost">
              <feFuncA type="linear" slope="2.0" />
            </feComponentTransfer>
            <feMerge>
              <feMergeNode in="boost" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Left Input Paths (Subtle Tech Gradients, convergent) */}
        {leftPaths.map((path) => {
          let strokeUrl = "url(#fade-left-slate)";
          if (path.id === "left-teal") strokeUrl = "url(#fade-left-teal)";
          if (path.id === "left-cyan") strokeUrl = "url(#fade-left-cyan)";

          return (
            <motion.path
              key={path.id}
              d={path.d}
              stroke={strokeUrl}
              strokeWidth="2.5"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 2.8, ease: "easeOut" }}
            />
          );
        })}

        {/* Right Output Path (Thick Neon Purple Wave with Drop Shadow Glow) */}
        <motion.path
          d={rightPath}
          stroke="url(#fade-right-violet)"
          strokeWidth="6"
          style={{ filter: "drop-shadow(0 0 12px #7C3AED)" }}
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 3.2, ease: "easeOut", delay: 0.6 }}
        />
      </svg>
    </div>
  );
}
