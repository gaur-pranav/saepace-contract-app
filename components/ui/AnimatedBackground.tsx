"use client";

import { motion } from "framer-motion";

export function AnimatedBackground() {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden bg-[#0A0A0B]">
      {/* Background blobs for a blurred aurora/mesh effect */}
      <motion.div
        className="absolute top-[-10%] left-[-10%] h-[50vh] w-[50vw] rounded-full bg-indigo-900/20 blur-[120px]"
        animate={{
          y: [0, 50, 0],
          x: [0, 30, 0],
          rotate: [0, 10, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-[-10%] right-[-10%] h-[60vh] w-[60vw] rounded-full bg-rose-900/10 blur-[120px]"
        animate={{
          y: [0, -40, 0],
          x: [0, -30, 0],
          rotate: [0, -10, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
}
