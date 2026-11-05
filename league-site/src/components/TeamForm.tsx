"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function TeamForm() {
  const [name, setName] = useState("");
  const [abbr, setAbbr] = useState("");
  const [division, setDivision] = useState("Alpha Division");
  const [logo, setLogo] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setLogo(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("Creating...");
    if (!logo) {
      setMessage("Please upload a team logo");
      return;
    }
    try {
      const res = await fetch("/api/teams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, abbreviation: abbr, division, logo }),
      });
      const json = await res.json();
      setMessage(res.ok ? `Created! ID: ${json.id}` : `Error: ${json.error || "unknown"}`);
      if (res.ok) {
        setName("");
        setAbbr("");
        setDivision("Alpha Division");
        setLogo(null);
        setTimeout(() => router.refresh(), 500);
      }
    } catch (err: any) {
      setMessage("Network error: " + err.message);
    }
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
          <option>Alpha Division</option>
          <option>Delta Division</option>
          <option>Gamma Division</option>
          <option>Omega Division</option>
        </select>
      </div>
      <div>
        <label className="block text-sm mb-1 text-neutral-300">Team Logo *</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleFile}
          className="text-sm text-neutral-300 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:bg-neutral-700 file:text-white"
          required
        />
        {logo && <img src={logo} alt="preview" className="mt-1 h-8 w-8 object-contain" />}
      </div>
      <button type="submit" className="bg-neutral-200 hover:bg-white text-black font-bold px-4 py-2 rounded">
        Create Team
      </button>
      {message && <p className="text-sm text-amber-300 w-full">{message}</p>}
    </form>
  );
}