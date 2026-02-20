"use client";

import { useEffect, useState } from "react";

export default function LocalTimeClient() {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const updateTime = () => {
      setTime(new Date().toLocaleString("de-DE", { timeZone: "Europe/Berlin" }));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!time) return null;

  return (
    <p className="font-mono text-[11px] text-foreground/70 tracking-wider">
      {time}
    </p>
  );
}
