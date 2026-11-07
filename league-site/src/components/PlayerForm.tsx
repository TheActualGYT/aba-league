"use client";

import { useEffect, useState } from "react";
import { useCloseOnOutside } from "@/components/useCloseOnOutside";

const fieldClass = "w-full px-3 py-2 bg-neutral-800 border border-neutral-600 rounded text-white";
const labelClass = "block text-xs font-semibold tracking-wide text-neutral-400 mb-1.5";

const HEIGHTS = (() => {
  const options: string[] = [];
  for (let feet = 5; feet <= 7; feet++) {
    const minInches = feet === 5 ? 3 : 0;
    const maxInches = feet === 7 ? 7 : 11;
    for (let inches = minInches; inches <= maxInches; inches++) {
      options.push(`${feet}'${inches}"`);
    }
  }
  return options;
})();

function digitsOnly(value: string, max: number) {
  return value.replace(/\D/g, "").slice(0, max);
}

function lettersOnly(value: string, max: number) {
  return value.replace(/\d/g, "").slice(0, max);
}

function jerseyError(raw: string) {
  const value = raw.trim();
  if (!value) return "";
  const digits = /^\d+$/.test(value);
  const overCap = !digits || value.length > 2 || Number(value) > 55;
  const badDigit = digits && [...value].some(digit => Number(digit) > 5);
  const illegal = !/^(?:[0-5]|00|[1-5][0-5])$/.test(value);
  if (!overCap && !badDigit && !illegal) return "";
  if (overCap && !badDigit) return `Jersey numbers cap at 55. ${value} isn't allowed.`;
  return `Each digit has to be 0\u20135. ${value} isn't allowed.`;
}

function overallError(raw: string) {
  const value = raw.trim();
  if (!value) return "";
  if (!/^\d+$/.test(value) || Number(value) < 10 || Number(value) > 99) {
    return "Rating has to be between 10 and 99.";
  }
  return "";
}

function weightError(raw: string) {
  const value = raw.trim();
  if (!value) return "";
  if (!/^\d+$/.test(value) || Number(value) < 150 || Number(value) > 400) {
    return "Weight has to be between 150 and 400.";
  }
  return "";
}

function useSettledError(value: string, error: string) {
  const [shown, setShown] = useState("");

  useEffect(() => {
    if (!error) {
      setShown("");
      return;
    }
    setShown("");
    const timer = window.setTimeout(() => setShown(error), 2000);
    return () => window.clearTimeout(timer);
  }, [value, error]);

  return shown;
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
  const rootRef = useCloseOnOutside<HTMLDivElement>(open, setOpen);
  const current = options.find(option => option.value === value);

  return (
    <div className="relative" ref={rootRef}>
      <button
        type="button"
        onClick={() => setOpen(currentOpen => !currentOpen)}
        className={`${fieldClass} text-left flex items-center justify-between min-h-[42px] ${invalid ? "abbr-taken" : ""}`}
      >
        <span>{current?.label || ""}</span>
        <span className="text-neutral-400 text-[10px]">▼</span>
      </button>
      {open && (
        <div className="absolute z-30 mt-1 w-full bg-neutral-800 border border-neutral-600 rounded overflow-hidden shadow-lg max-h-60 overflow-y-auto">
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
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [number, setNumber] = useState("");
  const [hand, setHand] = useState("");
  const [message, setMessage] = useState("");
  const [tried, setTried] = useState(false);
  const [revealNow, setRevealNow] = useState(false);

  const overallMessage = overallError(overall);
  const numberMessage = jerseyError(number);
  const weightMessage = weightError(weight);
  const settledOverall = useSettledError(overall, overallMessage);
  const settledNumber = useSettledError(number, numberMessage);
  const settledWeight = useSettledError(weight, weightMessage);
  const shownOverall = revealNow ? overallMessage : settledOverall;
  const shownNumber = revealNow ? numberMessage : settledNumber;
  const shownWeight = revealNow ? weightMessage : settledWeight;
  const blocked =
    !firstName.trim() ||
    !lastName.trim() ||
    !overall.trim() ||
    !height ||
    !weight.trim() ||
    !number.trim() ||
    !hand ||
    !!overallMessage ||
    !!numberMessage ||
    !!weightMessage;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (blocked) return;
    setTried(true);
    setMessage("Creating...");
    try {
      const res = await fetch("/api/players", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name: firstName,
          last_name: lastName,
          overall,
          height,
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
      <h3 className="label-glow text-white text-lg font-bold tracking-widest mb-4">VITALS</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
        <div className="lg:col-span-2">
          <label className={labelClass}>First Name</label>
          <input value={firstName} maxLength={11} onChange={e => setFirstName(lettersOnly(e.target.value, 11))} className={fieldClass} />
        </div>
        <div className="lg:col-span-2">
          <label className={labelClass}>Last Name</label>
          <input value={lastName} maxLength={11} onChange={e => setLastName(lettersOnly(e.target.value, 11))} className={fieldClass} />
        </div>
        <div className="lg:col-span-2">
          <label className={labelClass}>Rating</label>
          <input
            value={overall}
            maxLength={3}
            onChange={e => {
              setRevealNow(false);
              setOverall(digitsOnly(e.target.value, 3));
            }}
            inputMode="numeric"
            className={`${fieldClass} ${shownOverall ? "abbr-taken" : ""}`}
          />
          {shownOverall && <p className="text-xs text-red-400 mt-1">{shownOverall}</p>}
        </div>
        <div className="lg:col-span-2">
          <label className={labelClass}>Height</label>
          <Menu
            value={height}
            onChange={setHeight}
            invalid={tried && !height}
            options={HEIGHTS.map(option => ({ value: option, label: option }))}
          />
        </div>
        <div className="lg:col-span-2">
          <label className={labelClass}>Weight</label>
          <input
            value={weight}
            maxLength={3}
            onChange={e => {
              setRevealNow(false);
              setWeight(digitsOnly(e.target.value, 3));
            }}
            inputMode="numeric"
            className={`${fieldClass} ${shownWeight ? "abbr-taken" : ""}`}
          />
          {shownWeight && <p className="text-xs text-red-400 mt-1">{shownWeight}</p>}
        </div>
        <div className="lg:col-span-2">
          <label className={labelClass}>Jersey Number</label>
          <input
            value={number}
            maxLength={2}
            onChange={e => {
              setRevealNow(false);
              setNumber(digitsOnly(e.target.value, 2));
            }}
            inputMode="numeric"
            className={`${fieldClass} ${shownNumber ? "abbr-taken" : ""}`}
          />
          {shownNumber && <p className="text-xs text-red-400 mt-1">{shownNumber}</p>}
        </div>
        <div className="lg:col-span-2">
          <label className={labelClass}>Dominant Hand</label>
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
        <button
          type="submit"
          disabled={blocked}
          className={`bg-neutral-200 text-black font-bold px-5 py-2 rounded ${
            blocked ? "opacity-40 cursor-not-allowed" : "hover:bg-white"
          }`}
        >
          Create Player
        </button>
      </div>
    </form>
  );
}
