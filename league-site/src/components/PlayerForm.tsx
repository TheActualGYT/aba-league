"use client";

import { useState } from "react";

const fieldClass = "w-full px-3 py-2 bg-neutral-800 border border-neutral-600 rounded text-white";
const labelClass = "block text-xs font-semibold tracking-wide text-neutral-400 mb-1.5";

function jerseyError(raw: string) {
  const value = raw.trim();
  if (!value) return "";
  if (!/^\d+$/.test(value) || value.length > 2 || Number(value) > 55) {
    return "Jersey numbers cap at 55.";
  }
  if ([...value].some(digit => Number(digit) > 5) || !/^(?:[0-5]|00|[1-5][0-5])$/.test(value)) {
    return "Each digit has to be 0\u20135. 17 isn't allowed.";
  }
  return "";
}

function overallError(raw: string) {
  const value = raw.trim();
  if (!value) return "";
  if (!/^\d+$/.test(value) || Number(value) < 10 || Number(value) > 99) {
    return "Overall has to be between 10 and 99.";
  }
  return "";
}

function Menu({
  value,
  options,
  onChange,
  invalid,
}: {
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
  invalid?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const current = options.find(option => option.value === value);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(currentOpen => !currentOpen)}
        className={`${fieldClass} text-left flex items-center justify-between min-h-[42px] ${invalid ? "!border-red-500" : ""}`}
      >
        <span>{current?.label || ""}</span>
        <span className="text-neutral-400 text-[10px]">▼</span>
      </button>
      {open && (
        <div className="absolute z-30 mt-1 w-full bg-neutral-800 border border-neutral-600 rounded overflow-hidden shadow-lg">
          {options.map(option => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onChange(option.value);
                setOpen(false);
              }}
              className={`block w-full text-left px-3 py-2 text-sm text-white hover:bg-neutral-700 ${value === option.value ? "bg-neutral-700" : ""}`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function PlayerForm() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [overall, setOverall] = useState("");
  const [feet, setFeet] = useState("");
  const [inches, setInches] = useState("");
  const [weight, setWeight] = useState("");
  const [number, setNumber] = useState("");
  const [hand, setHand] = useState("");
  const [message, setMessage] = useState("");
  const [tried, setTried] = useState(false);

  const overallMessage = overallError(overall);
  const numberMessage = jerseyError(number);
  const inchValue = Number(inches);
  const inchMessage = inches.trim() && (!Number.isInteger(inchValue) || inchValue < 0 || inchValue > 11)
    ? "Inches have to be from 0 to 11."
    : "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTried(true);
    if (!firstName.trim() || !lastName.trim() || !overall.trim() || !feet.trim() || !inches.trim() || !weight.trim() || !number.trim() || !hand) {
      setMessage("Fill out every vitals field.");
      return;
    }
    if (overallMessage || numberMessage || inchMessage) {
      setMessage("Fix the highlighted fields.");
      return;
    }
    setMessage("Creating...");
    try {
      const res = await fetch("/api/players", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name: firstName,
          last_name: lastName,
          overall,
          feet,
          inches,
          weight,
          number,
          hand,
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        setMessage(json.error || "Could not create player.");
        return;
      }
      window.location.href = "/players";
    } catch (err: any) {
      setMessage("Network error: " + err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-neutral-900 border border-neutral-700 rounded-lg p-5">
      <h3 className="text-sm font-bold tracking-widest text-neutral-300 mb-4">VITALS</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
        <div className="lg:col-span-2">
          <label className={labelClass}>First Name</label>
          <input value={firstName} onChange={e => setFirstName(e.target.value)} className={fieldClass} />
        </div>
        <div className="lg:col-span-2">
          <label className={labelClass}>Last Name</label>
          <input value={lastName} onChange={e => setLastName(e.target.value)} className={fieldClass} />
        </div>
        <div className="lg:col-span-2">
          <label className={labelClass}>Overall</label>
          <input
            value={overall}
            onChange={e => setOverall(e.target.value)}
            inputMode="numeric"
            className={`${fieldClass} ${overallMessage ? "!border-red-500" : ""}`}
          />
          {overallMessage && <p className="text-xs text-red-400 mt-1">{overallMessage}</p>}
        </div>
        <div className="lg:col-span-2">
          <label className={labelClass}>HT</label>
          <div className="flex items-center gap-2">
            <input value={feet} onChange={e => setFeet(e.target.value)} inputMode="numeric" className={fieldClass} />
            <span className="text-neutral-400">'</span>
            <input
              value={inches}
              onChange={e => setInches(e.target.value)}
              inputMode="numeric"
              className={`${fieldClass} ${inchMessage ? "!border-red-500" : ""}`}
            />
            <span className="text-neutral-400">"</span>
          </div>
          {inchMessage && <p className="text-xs text-red-400 mt-1">{inchMessage}</p>}
        </div>
        <div>
          <label className={labelClass}>WT</label>
          <input value={weight} onChange={e => setWeight(e.target.value)} inputMode="numeric" className={fieldClass} />
        </div>
        <div>
          <label className={labelClass}>#</label>
          <input
            value={number}
            onChange={e => setNumber(e.target.value)}
            inputMode="numeric"
            className={`${fieldClass} ${numberMessage ? "!border-red-500" : ""}`}
          />
          {numberMessage && <p className="text-xs text-red-400 mt-1">{numberMessage}</p>}
        </div>
        <div className="lg:col-span-2">
          <label className={labelClass}>HAND</label>
          <Menu
            value={hand}
            onChange={setHand}
            invalid={tried && !hand}
            options={[
              { value: "Left", label: "Left" },
              { value: "Right", label: "Right" },
            ]}
          />
        </div>
      </div>
      <div className="mt-6 flex items-center justify-end gap-4">
        {message && <p className="text-sm text-amber-300 mr-auto">{message}</p>}
        <button type="submit" className="bg-neutral-200 text-black font-bold px-5 py-2 rounded hover:bg-white">
          Create Player
        </button>
      </div>
    </form>
  );
}
