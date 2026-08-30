import { CHART_FOR, SIZE_CHARTS, type Category, type SizeChart } from "./catalog";

export const GUIDE_STEPS = [
  {
    title: "Underbust",
    body: "Tape snug around the ribcage, just under the breasts. Exhale. This is the band.",
  },
  {
    title: "Bust",
    body: "Tape around the fullest point, level, not tight. The gap from underbust is the cup.",
  },
  {
    title: "Waist",
    body: "Narrowest point of the torso, usually above the navel. Stand easy — no cinch.",
  },
  {
    title: "Hip",
    body: "Fullest seat and outer thigh, tape parallel to the floor.",
  },
] as const;

export const BRA_BANDS = [
  { band: "30", cm: "63–67", inch: "25–26.5" },
  { band: "32", cm: "68–72", inch: "27–28.5" },
  { band: "34", cm: "73–77", inch: "29–30.5" },
  { band: "36", cm: "78–82", inch: "31–32.5" },
  { band: "38", cm: "83–87", inch: "33–34.5" },
  { band: "40", cm: "88–92", inch: "35–36.5" },
  { band: "42", cm: "93–97", inch: "37–38.5" },
] as const;

export const BRA_CUPS = [
  { cup: "A", deltaCm: "12–14", deltaIn: "1" },
  { cup: "B", deltaCm: "14–16", deltaIn: "2" },
  { cup: "C", deltaCm: "16–18", deltaIn: "3" },
  { cup: "D", deltaCm: "18–20", deltaIn: "4" },
] as const;

const BAND_MID: Record<string, number> = { "30": 65, "32": 70, "34": 75, "36": 80, "38": 85, "40": 90, "42": 95 };
const CUP_ADD: Record<string, { lo: number; hi: number }> = {
  A: { lo: 12, hi: 14 },
  B: { lo: 14, hi: 16 },
  C: { lo: 16, hi: 18 },
  D: { lo: 18, hi: 20 },
};

function cmIn(lo: number, hi: number) {
  const inch = (n: number) => (n / 2.54).toFixed(1).replace(/\.0$/, "");
  return { cm: `${lo}–${hi}`, inch: `${inch(lo)}–${inch(hi)}` };
}

export const BRA_MATRIX = SIZE_CHARTS.bra.map((size) => {
  const band = size.slice(0, -1);
  const cup = size.slice(-1);
  const mid = BAND_MID[band] ?? 75;
  const add = CUP_ADD[cup] ?? CUP_ADD.B;
  const bust = cmIn(mid + add.lo - 2, mid + add.hi + 2);
  const under = BRA_BANDS.find((b) => b.band === band);
  return {
    size,
    band,
    cup,
    underCm: under?.cm ?? "—",
    underIn: under?.inch ?? "—",
    bustCm: bust.cm,
    bustIn: bust.inch,
  };
});

export const BRA_CUPS_CUT = ["A", "B", "C", "D"] as const;
export const BRA_BANDS_CUT = ["30", "32", "34", "36", "38", "40", "42"] as const;

export function braIsCut(band: string, cup: string) {
  return SIZE_CHARTS.bra.includes(`${band}${cup}`);
}

export const SISTER_SIZES = [
  ["32A", "30B"],
  ["32B", "30C", "34A"],
  ["32C", "34B", "36A"],
  ["32D", "34C", "36B"],
  ["34D", "36C", "38B"],
  ["36D", "38C", "40B"],
  ["38D", "40C", "42B"],
  ["40C", "42B"],
  ["42C", "40D"],
] as const;

export const ALPHA_ROWS = [
  { size: "XS", bust: "78–82", waist: "60–64", hip: "86–90", bustIn: "30.5–32.5", waistIn: "23.5–25", hipIn: "34–35.5", uk: "4–6", us: "0–2", eu: "32–34" },
  { size: "S", bust: "83–87", waist: "65–69", hip: "91–95", bustIn: "32.5–34.5", waistIn: "25.5–27", hipIn: "36–37.5", uk: "8–10", us: "4–6", eu: "36–38" },
  { size: "M", bust: "88–92", waist: "70–74", hip: "96–100", bustIn: "34.5–36", waistIn: "27.5–29", hipIn: "38–39.5", uk: "12–14", us: "8–10", eu: "40–42" },
  { size: "L", bust: "93–97", waist: "75–79", hip: "101–105", bustIn: "36.5–38", waistIn: "29.5–31", hipIn: "40–41.5", uk: "16–18", us: "12–14", eu: "44–46" },
  { size: "XL", bust: "98–104", waist: "80–86", hip: "106–112", bustIn: "38.5–41", waistIn: "31.5–34", hipIn: "41.5–44", uk: "20–22", us: "16–18", eu: "48–50" },
  { size: "XXL", bust: "105–112", waist: "87–94", hip: "113–120", bustIn: "41.5–44", waistIn: "34.5–37", hipIn: "44.5–47", uk: "24–26", us: "20–22", eu: "52–54" },
] as const;

export const NIGHTY_ROWS = [
  { size: "Free Size", bust: "83–97", waist: "65–79", hip: "91–105", length: "78–86", note: "Drapes S–L" },
  { size: "S", bust: "83–87", waist: "65–69", hip: "91–95", length: "82", note: "Short hem above the knee" },
  { size: "M", bust: "88–92", waist: "70–74", hip: "96–100", length: "84", note: "House default" },
  { size: "L", bust: "93–97", waist: "75–79", hip: "101–105", length: "86", note: "Ease through the hip" },
  { size: "XL", bust: "98–104", waist: "80–86", hip: "106–112", length: "88", note: "Longer strap drop" },
] as const;

export const GOWN_ROWS = [
  { size: "M", bust: "88–92", waist: "70–74", hip: "96–100", length: "145", note: "Floor on 165–170 cm height" },
  { size: "L", bust: "93–97", waist: "75–79", hip: "101–105", length: "147", note: "Floor on 168–173 cm" },
  { size: "XL", bust: "98–104", waist: "80–86", hip: "106–112", length: "149", note: "Take XL if between L/XL at the hip" },
  { size: "XXL", bust: "105–112", waist: "87–94", hip: "113–120", length: "151", note: "Fuller seat, same hem drop" },
] as const;

export const CORSET_ROWS = [
  { size: "XS", waistClosed: "58–62", waistOpen: "64–68", rib: "70–74" },
  { size: "S", waistClosed: "63–67", waistOpen: "69–73", rib: "75–79" },
  { size: "M", waistClosed: "68–72", waistOpen: "74–78", rib: "80–84" },
  { size: "L", waistClosed: "73–77", waistOpen: "79–83", rib: "85–89" },
  { size: "XL", waistClosed: "78–84", waistOpen: "84–90", rib: "90–96" },
  { size: "XXL", waistClosed: "85–92", waistOpen: "91–98", rib: "97–104" },
] as const;

export const HOSE_ROWS = [
  { size: "XS", height: "150–158", inseam: "70–74", thigh: "48–52" },
  { size: "S", height: "155–163", inseam: "73–77", thigh: "50–54" },
  { size: "M", height: "160–168", inseam: "76–80", thigh: "53–57" },
  { size: "L", height: "165–173", inseam: "79–83", thigh: "56–61" },
  { size: "XL", height: "170–178", inseam: "82–86", thigh: "60–66" },
  { size: "XXL", height: "173–182", inseam: "84–88", thigh: "65–72" },
] as const;

export const PANTIES_ROWS = [
  { size: "XS", hip: "86–90", waist: "60–64" },
  { size: "S", hip: "91–95", waist: "65–69" },
  { size: "M", hip: "96–100", waist: "70–74" },
  { size: "L", hip: "101–105", waist: "75–79" },
  { size: "XL", hip: "106–112", waist: "80–86" },
  { size: "XXL", hip: "113–120", waist: "87–94" },
] as const;

export const SWIM_ROWS = [
  { size: "XS", bust: "78–82", hip: "86–90", cup: "30B / 32A" },
  { size: "S", bust: "83–87", hip: "91–95", cup: "32B / 32C" },
  { size: "M", bust: "88–92", hip: "96–100", cup: "34B / 34C" },
  { size: "L", bust: "93–97", hip: "101–105", cup: "36C / 36D" },
  { size: "XL", bust: "98–104", hip: "106–112", cup: "38C / 38D" },
  { size: "XXL", bust: "105–112", hip: "113–120", cup: "40C / 42C" },
] as const;

export const CHART_COPY: Record<SizeChart, { id: string; title: string; kicker: string; body: string }> = {
  bra: {
    id: "bras",
    title: "Bras & bridal sets",
    kicker: "Band + cup",
    body: "Match underbust to the band, then the gap to the cup. We cut the cups listed — empty cells are not in this house.",
  },
  alpha: {
    id: "body",
    title: "Body & lounge",
    kicker: "XS–XXL",
    body: "Panties, teddies, camisoles, lounge, thermal, shapewear. Centimetres and inches, plus UK / US / EU.",
  },
  nighty: {
    id: "night",
    title: "Nighties & babydolls",
    kicker: "Free Size · S–XL",
    body: "Short and long nighties, babydolls, getting-ready robes. Length is centre-back, cm.",
  },
  gown: {
    id: "gowns",
    title: "Gowns",
    kicker: "M–XXL",
    body: "Floor-length satin. Length is centre-back. Between sizes at the hip — take the larger.",
  },
  free: {
    id: "free",
    title: "Free size",
    kicker: "One cut",
    body: "Body stockings, sarongs, masks, chains. One size, made to drape S–XL.",
  },
};

export const EXTRA_NAV = [
  { id: "corset", kicker: "Corsetry" },
  { id: "hose", kicker: "Hosiery" },
  { id: "swim", kicker: "Swim" },
] as const;

export const AISLE_CHARTS = (Object.entries(CHART_FOR) as [Category, SizeChart][]).map(([aisle, chart]) => ({
  aisle,
  chart: CHART_COPY[chart].title,
  href: `#${CHART_COPY[chart].id}`,
}));

export function parseSpan(s: string): [number, number] {
  const [a, b] = s.split("–").map((n) => Number(n));
  return [a, b];
}

export const BODY_RANGE = ALPHA_ROWS.map((r) => {
  const bust = parseSpan(r.bust);
  const waist = parseSpan(r.waist);
  const hip = parseSpan(r.hip);
  return {
    size: r.size,
    bustOff: bust[0],
    bust: bust[1] - bust[0],
    bustHi: bust[1],
    waistOff: waist[0],
    waist: waist[1] - waist[0],
    waistHi: waist[1],
    hipOff: hip[0],
    hip: hip[1] - hip[0],
    hipHi: hip[1],
  };
});

export const CUP_VOLUME = BRA_CUPS.map((c) => {
  const [lo, hi] = parseSpan(c.deltaCm);
  return { cup: c.cup, lo, hi, mid: (lo + hi) / 2 };
});

export const BAND_VOLUME = BRA_BANDS.map((b) => {
  const [lo, hi] = parseSpan(b.cm);
  return { band: b.band, lo, hi, mid: (lo + hi) / 2 };
});

export const MEASURE_MARKS = [
  { id: "bust", label: "Bust", top: "38%" },
  { id: "under", label: "Underbust", top: "44%" },
  { id: "waist", label: "Waist", top: "51%" },
  { id: "hip", label: "Hip", top: "63%" },
] as const;
