"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function TeamForm() {
  const [name, setName] = useState("");
  const [abbr, setAbbr] = useState("");
  const [division, setDivision] = useState("Omega Division");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("/api/teams", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, abbreviation: abbr, division }),
    });
    setName("");
    setAbbr("");
    setDivision("Omega Division");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="bg-neutral-900 p-4 rounded-lg mb-6 flex gap-4 items-end border border-neutral-700 flex-wrap">
      <div>
        <label className="block text-sm mb-1 text-neutral-300">Team Name</label>
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          className="px-3 py-2 bg-neutral-800 border border-neutral-600 rounded text-white"
          required
        />
      </div>
      <div>
        <label className="block text-sm mb-1 text-neutral-300">Abbr</label>
        <input
          value={abbr}
          onChange={e => setAbbr(e.target.value.toUpperCase())}
          maxLength={4}
          className="px-3 py-2 bg-neutral-800 border border-neutral-600 rounded w-20 text-white"
          required
        />
      </div>
      <div>
        <label className="block text-sm mb-1 text-neutral-300">Division</label>
        <select
          value={division}
          onChange={e => setDivision(e.target.value)}
          className="px-3 py-2 bg-neutral-800 border border-neutral-600 rounded text-white"
        >
          <option>Omega Division</option>
          <option>Alpha Division</option>
          <option>Gamma Division</option>
          <option>Delta Division</option>
        </select>
      </div>
      <button type="submit" className="bg-neutral-200 hover:bg-white text-black font-bold px-4 py-2 rounded">
        Create Team
      </button>
    </form>
  );
}