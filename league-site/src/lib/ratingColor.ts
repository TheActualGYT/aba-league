const STOPS: { at: number; rgb: [number, number, number] }[] = [
  { at: 10, rgb: [0xdd, 0x7e, 0x6b] },
  { at: 55, rgb: [0xea, 0x99, 0x99] },
  { at: 65, rgb: [0xf9, 0xcb, 0x9c] },
  { at: 75, rgb: [0xff, 0xe5, 0x99] },
  { at: 85, rgb: [0xb6, 0xd7, 0xa8] },
  { at: 90, rgb: [0x9f, 0xc5, 0xe8] },
  { at: 99, rgb: [0xb4, 0xa7, 0xd6] },
];

export const RATING_INK = "#161616";

function mix(rating: number) {
  const value = Math.min(99, Math.max(10, rating));
  let lower = STOPS[0];
  let upper = STOPS[STOPS.length - 1];
  for (let index = 0; index < STOPS.length - 1; index++) {
    if (value >= STOPS[index].at && value <= STOPS[index + 1].at) {
      lower = STOPS[index];
      upper = STOPS[index + 1];
      break;
    }
  }
  const span = upper.at - lower.at;
  const t = span === 0 ? 0 : (value - lower.at) / span;
  return lower.rgb.map((channel, index) => Math.round(channel + (upper.rgb[index] - channel) * t)) as [number, number, number];
}

export function ratingFill(value: string) {
  const raw = value.trim();
  if (!/^\d{2}$/.test(raw)) return null;
  const [red, green, blue] = mix(Number(raw));
  return `rgb(${red}, ${green}, ${blue})`;
}
