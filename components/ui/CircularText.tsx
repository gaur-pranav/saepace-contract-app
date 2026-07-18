"use client";

import React, { useRef, useState, useEffect } from "react";
import { useAnimationFrame } from "framer-motion";

interface CircularTextProps {
  text: string;
  spinDuration?: number; // in seconds
  onHover?: "pause" | "speedUp" | "slowDown" | "goBonkers";
  radius?: number; // in pixels
  className?: string;
}

export function CircularText({
  text,
  spinDuration = 20,
  onHover = "speedUp",
  radius = 200,
  className = "",
}: CircularTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const angleRef = useRef(0);

  // Base speed in degrees per second
  const baseSpeed = 360 / spinDuration;

  // Determine target speed based on hover state
  let targetSpeed = baseSpeed;
  if (isHovered) {
    if (onHover === "speedUp") {
      targetSpeed = baseSpeed * 5;
    } else if (onHover === "slowDown") {
      targetSpeed = baseSpeed * 0.2;
    } else if (onHover === "goBonkers") {
      targetSpeed = baseSpeed * 10;
    } else if (onHover === "pause") {
      targetSpeed = 0;
    }
  }

  // Smoothly LERP speed to create acceleration/deceleration transitions
  const currentSpeedRef = useRef(baseSpeed);
  const lastTimeRef = useRef(0);

  useAnimationFrame((time) => {
    if (lastTimeRef.current === 0) {
      lastTimeRef.current = time;
      return;
    }

    const delta = time - lastTimeRef.current;
    lastTimeRef.current = time;

    // Smooth speed interpolation
    currentSpeedRef.current += (targetSpeed - currentSpeedRef.current) * 0.08;

    // Accumulate the rotation angle
    angleRef.current += (currentSpeedRef.current * delta) / 1000;
    angleRef.current = angleRef.current % 360;

    // Directly transform DOM node with GPU acceleration (translateZ(0))
    if (containerRef.current) {
      containerRef.current.style.transform = `rotate(${angleRef.current}deg) translateZ(0)`;
    }
  });

  const chars = text.split("");
  const angleStep = 360 / chars.length;
  const size = radius * 2;

  return (
    <div
      className={`relative flex items-center justify-center pointer-events-none select-none ${className}`}
      style={{
        width: "100%",
        height: "100%",
        maxWidth: size,
        maxHeight: size,
        aspectRatio: "1/1",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        ref={containerRef}
        className="w-full h-full relative pointer-events-auto"
        style={{
          transformOrigin: "center center",
          transition: "scale 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
          scale: isHovered && onHover === "goBonkers" ? 1.08 : 1,
          willChange: "transform",
        }}
      >
        {chars.map((char, idx) => {
          const charAngle = idx * angleStep;
          return (
            <span
              key={idx}
              className="absolute left-1/2 top-1/2 select-none text-[inherit] font-mono font-bold"
              style={{
                display: "inline-block",
                transform: `translate(-50%, -50%) rotate(${charAngle}deg) translateY(-${radius}px)`,
                transformOrigin: "center center",
                whiteSpace: "pre",
              }}
            >
              {char}
            </span>
          );
        })}
      </div>
    </div>
  );
}
