"use client";

import { useEffect, useState } from "react";

export default function LocalTimeClient() {
  const [time, setTime] = useState<string | null>(null);
  const [triggerRerender, setTriggerRerender] = useState(0);


  useEffect(() => {
    const interval = setInterval(() => {
      setTriggerRerender((prev) => prev + 1);
    }, 1000);

    setTime(
      new Date().toLocaleString("de-DE", { timeZone: "Europe/Berlin" })
    );
    return () => clearInterval(interval);
  }, [triggerRerender]);

  if (!time) return null;

  return (
    <p className="font-mono text-[11px] text-foreground/70 tracking-wider">
      {time}
    </p>
  );
}
