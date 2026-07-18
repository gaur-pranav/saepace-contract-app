"use client";

interface PillProps {
  type?: "pro" | "fun";
  status?: "pending" | "approved";
  className?: string;
}

export function Pill({ type, status, className = "" }: PillProps) {
  if (type) {
    const styles = {
      pro: "bg-[#7C3AED]/15 text-[#a78bfa] border-[#7C3AED]/20",
      fun: "bg-[#06B6D4]/15 text-[#67e8f9] border-[#06B6D4]/20",
    };

    return (
      <span
        className={`inline-flex items-center rounded-full border px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider ${styles[type]} ${className}`}
      >
        {type === "pro" ? "PRO" : "FUN"}
      </span>
    );
  }

  if (status) {
    const styles = {
      pending: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
      approved: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    };

    return (
      <span
        className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider ${styles[status]} ${className}`}
      >
        <span
          className={`h-1.5 w-1.5 rounded-full ${
            status === "pending"
              ? "bg-yellow-400 animate-pulse-slow"
              : "bg-emerald-400"
          }`}
        />
        {status === "pending" ? "Pending" : "Approved"}
      </span>
    );
  }

  return null;
}
