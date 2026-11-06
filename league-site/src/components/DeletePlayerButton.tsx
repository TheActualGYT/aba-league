"use client";

import { useState } from "react";

export default function DeletePlayerButton({ playerId, playerName }: { playerId: number; playerName: string }) {
  const [confirming, setConfirming] = useState(false);
  const [status, setStatus] = useState("");

  const handleDelete = async () => {
    setStatus("Deleting...");
    try {
      const res = await fetch("/api/players", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: playerId }),
      });
      const json = await res.json();
      if (!res.ok) {
        setStatus(json.error || "Failed");
        return;
      }
      setTimeout(() => window.location.reload(), 300);
    } catch (err: any) {
      setStatus("Error: " + err.message);
    }
  };

  if (confirming) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-xs text-red-400">Delete {playerName}?</span>
        <button onClick={handleDelete} className="text-xs bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded">Yes</button>
        <button onClick={() => setConfirming(false)} className="text-xs bg-neutral-700 hover:bg-neutral-600 text-white px-2 py-1 rounded">No</button>
        {status && <span className="text-xs text-neutral-400">{status}</span>}
      </div>
    );
  }

  return (
    <button onClick={() => setConfirming(true)} className="text-xs text-red-400 hover:text-red-300">
      Delete
    </button>
  );
}
