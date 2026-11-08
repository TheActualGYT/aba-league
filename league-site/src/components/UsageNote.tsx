"use client";

import { useEffect, useState } from "react";
import { usageHit, type UsageIndex } from "@/lib/playerUsage";

export default function UsageNote({
  index,
  field,
  value,
}: {
  index?: UsageIndex;
  field: string;
  value: string;
}) {
  const hit = usageHit(index, field, value);
  const [shown, setShown] = useState<ReturnType<typeof usageHit>>(null);

  useEffect(() => {
    setShown(null);
    if (!hit) return;
    const timer = window.setTimeout(() => setShown(hit), 2000);
    return () => window.clearTimeout(timer);
  }, [field, value, hit?.text, hit?.shared, hit?.title]);

  if (!shown) return null;
  return (
    <p title={shown.title} className={`text-[11px] mt-1 leading-none ${shown.shared ? "text-yellow-300" : "text-green-400"}`}>
      {shown.text}
    </p>
  );
}
