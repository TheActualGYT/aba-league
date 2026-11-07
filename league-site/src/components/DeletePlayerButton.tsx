"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

export default function DeletePlayerButton({ playerId, playerName }: { playerId: number; playerName: string }) {
  const [step, setStep] = useState(0);
  const [status, setStatus] = useState("");

  useEffect(() => {
    if (step !== 2) return;
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setStatus("");
        setStep(0);
      }
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [step]);

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

  const close = () => {
    setStatus("");
    setStep(0);
  };

  const popup = step === 2 && typeof document !== "undefined" && createPortal(
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/70 px-4" onClick={close}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-player-title"
        className="w-full max-w-sm rounded-lg border border-neutral-600 bg-neutral-900 p-5 shadow-2xl"
        onClick={event => event.stopPropagation()}
      >
        <h3 id="delete-player-title" className="text-center text-sm font-bold tracking-widest text-white">DELETE PLAYER</h3>
        <p className="mt-3 text-center text-sm text-neutral-300">
          Delete <span className="font-semibold text-white">{playerName}</span>?
        </p>
        <p className="mt-1 text-center text-xs text-neutral-500">Last confirmation. This cannot be undone.</p>
        {status && <p className="mt-3 text-center text-xs text-amber-300">{status}</p>}
        <div className="mt-5 flex items-center justify-center gap-3">
          <button type="button" onClick={close} className="rounded bg-neutral-700 px-4 py-1.5 text-sm text-white hover:bg-neutral-600">
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={status === "Deleting..."}
            className="rounded bg-red-600 px-4 py-1.5 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
          >
            Delete
          </button>
        </div>
      </div>
    </div>,
    document.body
  );

  if (step === 1) {
    return (
      <span className="inline-flex h-5 items-center gap-1.5">
        <span className="text-[10px] leading-5 text-neutral-500">1/2</span>
        <button type="button" onClick={() => setStep(2)} className="text-xs leading-5 text-neutral-200 hover:text-white">
          Yes
        </button>
        <button type="button" onClick={close} className="text-xs leading-5 text-neutral-400 hover:text-white">
          No
        </button>
        {popup}
      </span>
    );
  }

  return (
    <>
      <button type="button" onClick={() => setStep(1)} className="text-xs leading-5 text-red-400 hover:text-red-300">
        Delete
      </button>
      {popup}
    </>
  );
}
