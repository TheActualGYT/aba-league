"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DeleteTeamButton({ teamId, teamName }: { teamId: number; teamName: string }) {
  const [confirming, setConfirming] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    await fetch("/api/teams", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: teamId }),
    });
    setConfirming(false);
    router.refresh();
  };

  if (confirming) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-xs text-red-400">Delete {teamName}?</span>
        <button onClick={handleDelete} className="text-xs bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded">
          Yes
        </button>
        <button onClick={() => setConfirming(false)} className="text-xs bg-neutral-700 hover:bg-neutral-600 text-white px-2 py-1 rounded">
          No
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="text-xs text-red-400 hover:text-red-300"
    >
      Delete
    </button>
  );
}