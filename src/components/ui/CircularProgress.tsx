"use client";
import { useEffect, useState } from "react";

interface Props {
  pct: number;
  label?: string;
  sublabel?: string;
  size?: number;
  strokeWidth?: number;
}

export function CircularProgress({
  pct,
  label,
  sublabel,
  size = 160,
  strokeWidth = 10,
}: Props) {
  const [displayed, setDisplayed] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setDisplayed(Math.min(100, Math.max(0, pct))), 80);
    return () => clearTimeout(t);
  }, [pct]);

  const r = (size - strokeWidth) / 2 - 2;
  const cx = size / 2;
  const cy = size / 2;
  const circumference = 2 * Math.PI * r;
  const offset = circumference * (1 - displayed / 100);

  const stroke =
    displayed >= 100
      ? "#22c55e"
      : displayed >= 50
      ? "hsl(var(--primary))"
      : displayed > 0
      ? "#f59e0b"
      : "hsl(var(--border))";

  return (
    <div
      className="relative inline-flex items-center justify-center shrink-0"
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        className="absolute -rotate-90"
        aria-hidden="true"
      >
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke="hsl(var(--muted))"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke={stroke}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{
            transition: "stroke-dashoffset 0.9s cubic-bezier(0.4,0,0.2,1), stroke 0.4s ease",
          }}
        />
      </svg>
      <div className="relative flex flex-col items-center justify-center gap-0.5 text-center">
        {label && (
          <span
            className="font-bold leading-none tabular-nums"
            style={{ fontSize: Math.round(size * 0.145) }}
          >
            {label}
          </span>
        )}
        {sublabel && (
          <span
            className="text-muted-foreground leading-none"
            style={{ fontSize: Math.round(size * 0.09) }}
          >
            {sublabel}
          </span>
        )}
        <span
          className="font-semibold leading-none"
          style={{
            fontSize: Math.round(size * 0.105),
            color: stroke,
            transition: "color 0.4s ease",
          }}
        >
          {displayed}%
        </span>
      </div>
    </div>
  );
}
