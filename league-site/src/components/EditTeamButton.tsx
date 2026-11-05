"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function EditTeamButton({ team }: { team: any }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(team.name);
  const [abbr, setAbbr] = useState(team.abbreviation);
  const [location, setLocation] = useState(team.location || "");
  const [ownership, setOwnership] = useState(team.ownership || "");
  const [logo, setLogo] = useState(team.logo || "");
  const [colors, setColors] = useState<string[]>(team.colors || []);
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setLogo(reader.result as string);
    reader.readAsDataURL(file);
  };

  const save = async () => {
    setMessage("Saving...");
    try {
      const res = await fetch("/api/teams", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: team.id, name, abbreviation: abbr, location, ownership, logo, colors }),
      });
      if (!res.ok) {
        setMessage("Failed to save");
        return;
      }
      setMessage("Saved!");
      setTimeout(() => {
        setOpen(false);
        window.location.reload();
      }, 400);
    } catch {
      setMessage("Error");
    }
  };

  return (
    <>
      <button onClick={() => setOpen(true)} className="text-xs text-neutral-300 hover:text-white">
        Edit
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50" onClick={() => setOpen(false)}>
          <div className="bg-neutral-900 border border-neutral-700 rounded-lg p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-white mb-4">Edit Team</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm text-neutral-300 mb-1">Name</label>
                <input value={name} onChange={e => setName(e.target.value)} className="w-full px-3 py-2 bg-neutral-800 border border-neutral-600 rounded text-white" />
              </div>
              <div>
                <label className="block text-sm text-neutral-300 mb-1">Abbr</label>
                <input value={abbr} onChange={e => setAbbr(e.target.value.toUpperCase())} maxLength={4} className="w-full px-3 py-2 bg-neutral-800 border border-neutral-600 rounded text-white" />
              </div>
              <div>
                <label className="block text-sm text-neutral-300 mb-1">Location</label>
                <input value={location} onChange={e => setLocation(e.target.value)} className="w-full px-3 py-2 bg-neutral-800 border border-neutral-600 rounded text-white" />
              </div>
              <div>
                <label className="block text-sm text-neutral-300 mb-1">Ownership</label>
                <input value={ownership} onChange={e => setOwnership(e.target.value)} className="w-full px-3 py-2 bg-neutral-800 border border-neutral-600 rounded text-white" />
              </div>
              <div>
                <label className="block text-sm text-neutral-300 mb-1">Logo</label>
                <input type="file" accept="image/*" onChange={handleFile} className="text-sm text-neutral-300" />
                {logo && <img src={logo} alt="" className="mt-1 h-10 w-10 object-contain" />}
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-5">
              <button onClick={() => setOpen(false)} className="px-4 py-2 text-neutral-300 hover:text-white">Cancel</button>
              <button onClick={save} className="bg-neutral-200 text-black font-bold px-4 py-2 rounded">Save</button>
            </div>
            {message && <p className="text-sm text-amber-300 mt-2">{message}</p>}
          </div>
        </div>
      )}
    </>
  );
}