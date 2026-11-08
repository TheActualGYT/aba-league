"use client";

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
  if (!hit) return null;
  return (
    <p title={hit.title} className={`text-[11px] mt-1 leading-none ${hit.shared ? "text-yellow-300" : "text-green-400"}`}>
      {hit.text}
    </p>
  );
}
