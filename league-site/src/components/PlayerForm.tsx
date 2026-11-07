"use client";

import { useEffect, useState } from "react";
import { useCloseOnOutside } from "@/components/useCloseOnOutside";

const fieldClass = "w-full h-8 px-2.5 text-sm bg-neutral-800 border border-neutral-600 rounded text-white";
const labelClass = "block text-[11px] font-semibold tracking-wide text-neutral-400 mb-1";
const compactLabel = "w-[5.6rem] shrink-0 text-[11px] font-semibold leading-tight tracking-wide text-neutral-400";
const compactField = "min-w-0 flex-1 h-[22px] px-1.5 text-[11px] bg-neutral-800 border border-neutral-600 rounded text-white placeholder:text-white/35";
const POSITIONS = ["C", "PF", "SF", "SG", "PG"];
const COMPLEXIONS = Array.from({ length: 10 }, (_, index) => `Complexion ${index + 1}`);
const TSHIRTS = ["None", "Muscle T", "Angled T", "Short Sleeve", "Long Sleeve"];
const SOCK_COLORS = ["White", "Black", "Team"];
const ACCESSORY_FIELDS = [
  { key: "headband", label: "Headband" },
  { key: "right_bicep", label: "Right Bicep" },
  { key: "left_bicep", label: "Left Bicep" },
  { key: "right_forearm", label: "Right Forearm" },
  { key: "left_forearm", label: "Left Forearm" },
  { key: "right_elbow", label: "Right Elbow" },
  { key: "left_elbow", label: "Left Elbow" },
  { key: "right_wrist", label: "Right Wrist" },
  { key: "left_wrist", label: "Left Wrist" },
  { key: "right_knee", label: "Right Knee" },
  { key: "left_knee", label: "Left Knee" },
  { key: "right_calf", label: "Right Calf" },
  { key: "left_calf", label: "Left Calf" },
] as const;

type AccessoryKey = (typeof ACCESSORY_FIELDS)[number]["key"];

const ACCESSORY_ROWS: { key: AccessoryKey; label: string }[][] = [
  [{ key: "headband", label: "Headband" }],
  [
    { key: "left_bicep", label: "Left Bicep" },
    { key: "right_bicep", label: "Right Bicep" },
  ],
  [
    { key: "left_forearm", label: "Left Forearm" },
    { key: "right_forearm", label: "Right Forearm" },
  ],
  [
    { key: "left_elbow", label: "Left Elbow" },
    { key: "right_elbow", label: "Right Elbow" },
  ],
  [
    { key: "left_wrist", label: "Left Wrist" },
    { key: "right_wrist", label: "Right Wrist" },
  ],
  [
    { key: "left_knee", label: "Left Knee" },
    { key: "right_knee", label: "Right Knee" },
  ],
  [
    { key: "left_calf", label: "Left Calf" },
    { key: "right_calf", label: "Right Calf" },
  ],
];

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

function headModelError(raw: string) {
  const value = raw.trim();
  if (!value) return "";
  if (!/^\d+$/.test(value) || Number(value) === 0) return "0 isn't allowed.";
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

function FieldLabel({ children, required }: { children: string; required?: boolean }) {
  return (
    <label className={labelClass}>
      {children}
      {required && <span className="text-red-400"> *</span>}
    </label>
  );
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
        className={`${fieldClass} text-left flex items-center justify-between ${invalid ? "abbr-taken" : ""}`}
      >
        <span className="truncate">{current?.label || ""}</span>
        <span className="text-neutral-400 text-[10px] ml-2">▼</span>
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
              className={`block w-full text-left px-2.5 py-1.5 text-sm text-white hover:bg-neutral-700 ${value === option.value ? "bg-neutral-700" : ""}`}
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
  const [position, setPosition] = useState("");
  const [overall, setOverall] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [number, setNumber] = useState("");
  const [hand, setHand] = useState("");
  const [skinTone, setSkinTone] = useState("");
  const [headModel, setHeadModel] = useState("");
  const [tshirtType, setTshirtType] = useState("None");
  const [sockStyle, setSockStyle] = useState("");
  const [sockColor, setSockColor] = useState("");
  const [shoesHome, setShoesHome] = useState("");
  const [shoesAway, setShoesAway] = useState("");
  const [accessories, setAccessories] = useState<Record<AccessoryKey, string>>({
    headband: "",
    right_bicep: "",
    left_bicep: "",
    right_forearm: "",
    left_forearm: "",
    right_elbow: "",
    left_elbow: "",
    right_wrist: "",
    left_wrist: "",
    right_knee: "",
    left_knee: "",
    right_calf: "",
    left_calf: "",
  });
  const [message, setMessage] = useState("");
  const [revealNow, setRevealNow] = useState(false);

  const overallMessage = overallError(overall);
  const numberMessage = jerseyError(number);
  const weightMessage = weightError(weight);
  const headMessage = headModelError(headModel);
  const settledOverall = useSettledError(overall, overallMessage);
  const settledNumber = useSettledError(number, numberMessage);
  const settledWeight = useSettledError(weight, weightMessage);
  const settledHead = useSettledError(headModel, headMessage);
  const shownOverall = revealNow ? overallMessage : settledOverall;
  const shownNumber = revealNow ? numberMessage : settledNumber;
  const shownWeight = revealNow ? weightMessage : settledWeight;
  const shownHead = revealNow ? headMessage : settledHead;
  const blocked =
    !firstName.trim() ||
    !lastName.trim() ||
    !position ||
    !!overallMessage ||
    !!numberMessage ||
    !!weightMessage ||
    !!headMessage;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (blocked) return;
    setRevealNow(true);
    setMessage("Creating...");
    try {
      const res = await fetch("/api/players", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name: firstName,
          last_name: lastName,
          position,
          overall,
          height,
          weight,
          number,
          hand,
          skin_tone: skinTone,
          head_model: headModel,
          tshirt_type: tshirtType,
          sock_style: sockStyle,
          sock_color: sockColor,
          shoes_home: shoesHome,
          shoes_away: shoesAway,
          ...accessories,
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
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 items-stretch">
        <section className="bg-neutral-900 border border-neutral-700 rounded-lg p-4 h-full">
          <h3 className="label-glow text-white text-lg font-bold tracking-widest mb-3">VITALS</h3>
          <div className="grid grid-cols-2 gap-x-3 gap-y-2.5">
            <div>
              <FieldLabel required>First Name</FieldLabel>
              <input value={firstName} maxLength={11} onChange={e => setFirstName(lettersOnly(e.target.value, 11))} className={fieldClass} />
            </div>
            <div>
              <FieldLabel required>Last Name</FieldLabel>
              <input value={lastName} maxLength={11} onChange={e => setLastName(lettersOnly(e.target.value, 11))} className={fieldClass} />
            </div>
            <div>
              <FieldLabel required>Position</FieldLabel>
              <Menu
                value={position}
                onChange={setPosition}
                options={POSITIONS.map(option => ({ value: option, label: option }))}
              />
            </div>
            <div>
              <FieldLabel>Rating</FieldLabel>
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
              {shownOverall && <p className="text-[11px] text-red-400 mt-1">{shownOverall}</p>}
            </div>
            <div>
              <FieldLabel>Height</FieldLabel>
              <Menu
                value={height}
                onChange={setHeight}
                options={HEIGHTS.map(option => ({ value: option, label: option }))}
              />
            </div>
            <div>
              <FieldLabel>Weight</FieldLabel>
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
              {shownWeight && <p className="text-[11px] text-red-400 mt-1">{shownWeight}</p>}
            </div>
            <div>
              <FieldLabel>Jersey Number</FieldLabel>
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
              {shownNumber && <p className="text-[11px] text-red-400 mt-1">{shownNumber}</p>}
            </div>
            <div>
              <FieldLabel>Dominant Hand</FieldLabel>
              <Menu
                value={hand}
                onChange={setHand}
                options={[
                  { value: "Left", label: "Left" },
                  { value: "Right", label: "Right" },
                ]}
              />
            </div>
          </div>
        </section>

        <section className="bg-neutral-900 border border-neutral-700 rounded-lg p-4 h-full">
          <h3 className="label-glow text-white text-lg font-bold tracking-widest mb-3">APPEARANCE</h3>
          <div className="grid grid-cols-2 gap-x-3 gap-y-2.5">
            <div>
              <FieldLabel>Skin Tone</FieldLabel>
              <Menu
                value={skinTone}
                onChange={setSkinTone}
                options={COMPLEXIONS.map(option => ({ value: option, label: option }))}
              />
            </div>
            <div>
              <FieldLabel>Body Type</FieldLabel>
              <div
                aria-readonly="true"
                className="w-full h-8 rounded border border-[#8a8a8a] cursor-default select-none"
                style={{
                  background: "linear-gradient(180deg, #8f8f8f 0%, #6d6d6d 48%, #7c7c7c 100%)",
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.4), inset 0 -1px 0 rgba(0,0,0,0.35)",
                }}
              />
            </div>
            <div>
              <FieldLabel>Head Model</FieldLabel>
              <input
                value={headModel}
                maxLength={3}
                inputMode="numeric"
                onChange={e => {
                  setRevealNow(false);
                  setHeadModel(digitsOnly(e.target.value, 3));
                }}
                className={`${fieldClass} ${shownHead ? "abbr-taken" : ""}`}
              />
              {shownHead && <p className="text-[11px] text-red-400 mt-1">{shownHead}</p>}
            </div>
            <div>
              <FieldLabel>T-Shirt Type</FieldLabel>
              <Menu
                value={tshirtType}
                onChange={setTshirtType}
                options={TSHIRTS.map(option => ({ value: option, label: option }))}
              />
            </div>
            <div>
              <FieldLabel>Sock Style</FieldLabel>
              <input value={sockStyle} onChange={e => setSockStyle(e.target.value)} className={fieldClass} />
            </div>
            <div>
              <FieldLabel>Sock Color</FieldLabel>
              <Menu
                value={sockColor}
                onChange={setSockColor}
                options={SOCK_COLORS.map(option => ({ value: option, label: option }))}
              />
            </div>
            <div>
              <FieldLabel>Shoes Home</FieldLabel>
              <input value={shoesHome} onChange={e => setShoesHome(e.target.value)} className={fieldClass} />
            </div>
            <div>
              <FieldLabel>Shoes Away</FieldLabel>
              <input value={shoesAway} onChange={e => setShoesAway(e.target.value)} className={fieldClass} />
            </div>
          </div>
        </section>

        <section className="bg-neutral-900 border border-neutral-700 rounded-lg p-4 h-full">
          <h3 className="label-glow text-white text-lg font-bold tracking-widest mb-3">ACCESSORIES</h3>
          <div className="grid grid-cols-2 gap-x-3 gap-y-2">
            {ACCESSORY_ROWS.map(row =>
              row.map(field => (
                <div key={field.key} className={`flex items-center gap-1.5 min-w-0 ${row.length === 1 ? "col-span-2" : ""}`}>
                  <span className={compactLabel}>{field.label}</span>
                  <input
                    value={accessories[field.key]}
                    placeholder="None"
                    onChange={e => setAccessories(current => ({ ...current, [field.key]: e.target.value }))}
                    className={compactField}
                  />
                </div>
              ))
            )}
          </div>
        </section>
      </div>

      <div className="mt-6 flex items-center justify-end gap-4">
        {message && <p className="text-sm text-amber-300 mr-auto">{message}</p>}
        <button
          type="submit"
          disabled={blocked}
          className={`bg-neutral-200 text-black font-bold px-5 py-2 rounded ${blocked ? "opacity-40 cursor-not-allowed" : "hover:bg-white"}`}
        >
          Create Player
        </button>
      </div>
    </form>
  );
}
