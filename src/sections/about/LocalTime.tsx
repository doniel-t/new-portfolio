"use client";

import { useEffect, useState } from "react";

type LocalTimeClientProps = {
  className?: string;
};

export default function LocalTimeClient({
  className = "font-mono text-[11px] text-foreground/70",
}: LocalTimeClientProps) {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const updateTime = () => {
      setTime(new Date().toLocaleTimeString("de-DE", { timeZone: "Europe/Berlin", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false }));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!time) return null;

  return (
    <p className={className}>
      {time}
    </p>
  );
}
