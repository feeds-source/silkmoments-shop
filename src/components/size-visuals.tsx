import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  ALPHA_ROWS,
  BAND_VOLUME,
  BODY_LINE,
  BRA_BANDS_CUT,
  BRA_CUPS_CUT,
  CORSET_CHART,
  CUP_VOLUME,
  GOWN_CHART,
  HOSE_CHART,
  INT_DRESS,
  MEASURE_MARKS,
  NIGHTY_CHART,
  SISTER_SIZES,
  bodyRangeFor,
  braIsCut,
  recommendFit,
  silhouetteFor,
  type FitResult,
  type FitUnit,
} from "@/lib/size-guide";

function useChartReady() {
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  return ready;
}

const tooltipStyle = {
  background: "var(--color-surface)",
  border: "1px solid var(--color-line)",
  borderRadius: "12px",
  color: "var(--color-fg)",
  fontSize: 12,
};

function ChartShell({ kicker, children, tall }: { kicker: string; children: ReactNode; tall?: boolean }) {
  return (
    <div className="mt-8 rounded-xl border border-line bg-surface p-4">
      <p className="text-2xs uppercase tracking-widest text-accent">{kicker}</p>
      <div className={tall ? "mt-3 h-80" : "mt-3 h-56"}>{children}</div>
    </div>
  );
}

export function UnitToggle({ unit, onChange }: { unit: FitUnit; onChange: (u: FitUnit) => void }) {
  return (
    <div className="inline-flex h-11 shrink-0 rounded-full border border-line p-0.5">
      {(["cm", "in"] as const).map((u) => (
        <button
          key={u}
          type="button"
          onClick={() => onChange(u)}
          className={`min-w-11 rounded-full px-4 text-2xs uppercase tracking-widest ${
            unit === u ? "bg-accent text-accent-fg" : "text-muted"
          }`}
        >
          {u}
        </button>
      ))}
    </div>
  );
}

export function MeasureFigures() {
  return (
    <div className="mt-8 grid gap-4 md:grid-cols-2">
      {(
        [
          { src: "/banners/measure-front.jpg", alt: "Front: where the tape sits" },
          { src: "/banners/measure-side.jpg", alt: "Side: bust, waist, hip" },
        ] as const
      ).map((fig) => (
        <figure key={fig.src} className="relative overflow-hidden rounded-xl border border-line bg-elevated">
          <img src={fig.src} alt={fig.alt} className="w-full object-cover object-top" />
          {MEASURE_MARKS.map((m) => (
            <div key={m.id} className="pointer-events-none absolute inset-x-0" style={{ top: m.top }}>
              <div className="gold-rule" />
              <span className="absolute right-3 -top-3 rounded-full bg-bg/80 px-2 py-1 text-2xs uppercase tracking-widest text-accent">
                {m.label}
              </span>
            </div>
          ))}
          <figcaption className="absolute inset-x-0 bottom-0 bg-bg/70 px-4 py-3 text-2xs uppercase tracking-widest text-muted">
            {fig.alt}
          </figcaption>
        </figure>
      ))}
    </div>
  );
}

export function BodyRangeChart({ unit }: { unit: FitUnit }) {
  const ready = useChartReady();
  const data = bodyRangeFor(unit);
  const domain: [number, number] = unit === "cm" ? [55, 125] : [22, 49];
  const label = unit === "cm" ? "cm" : "in";
  if (!ready) return <div className="mt-8 h-72 rounded-xl border border-line bg-surface" />;
  return (
    <div className="mt-8 rounded-xl border border-line bg-surface p-4">
      <p className="text-2xs uppercase tracking-widest text-accent">Bust · waist · hip, {label}</p>
      <div className="mt-3 h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart layout="vertical" data={data} margin={{ top: 8, right: 12, left: 8, bottom: 8 }} barCategoryGap={10}>
            <CartesianGrid stroke="var(--color-line)" horizontal={false} />
            <XAxis type="number" domain={domain} stroke="var(--color-subtle)" tick={{ fill: "var(--color-muted)", fontSize: 11 }} />
            <YAxis type="category" dataKey="size" stroke="var(--color-subtle)" tick={{ fill: "var(--color-fg)", fontSize: 12 }} width={40} />
            <Tooltip
              contentStyle={tooltipStyle}
              formatter={(value, name, item) => {
                const row = item?.payload as (typeof data)[number] | undefined;
                if (!row) return [String(value), String(name)];
                if (name === "bust") return [`${row.bustOff}–${row.bustHi} ${label}`, "Bust"];
                if (name === "waist") return [`${row.waistOff}–${row.waistHi} ${label}`, "Waist"];
                if (name === "hip") return [`${row.hipOff}–${row.hipHi} ${label}`, "Hip"];
                return [String(value), String(name)];
              }}
            />
            <Bar dataKey="bustOff" stackId="bust" fill="transparent" isAnimationActive={false} />
            <Bar dataKey="bust" stackId="bust" fill="var(--color-accent)" radius={[99, 99, 99, 99]} maxBarSize={14} />
            <Bar dataKey="waistOff" stackId="waist" fill="transparent" isAnimationActive={false} />
            <Bar dataKey="waist" stackId="waist" fill="var(--color-blush)" radius={[99, 99, 99, 99]} maxBarSize={14} />
            <Bar dataKey="hipOff" stackId="hip" fill="transparent" isAnimationActive={false} />
            <Bar dataKey="hip" stackId="hip" fill="var(--color-muted)" radius={[99, 99, 99, 99]} maxBarSize={14} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <ul className="mt-2 flex flex-wrap gap-4 text-2xs uppercase tracking-widest text-muted">
        <li className="flex items-center gap-2">
          <span className="inline-block size-2 rounded-full bg-accent" /> Bust
        </li>
        <li className="flex items-center gap-2">
          <span className="inline-block size-2 rounded-full bg-blush" /> Waist
        </li>
        <li className="flex items-center gap-2">
          <span className="inline-block size-2 rounded-full bg-muted" /> Hip
        </li>
      </ul>
    </div>
  );
}

export function BodyLineChart({ unit }: { unit: FitUnit }) {
  const ready = useChartReady();
  const data = useMemo(
    () =>
      BODY_LINE.map((r) =>
        unit === "cm"
          ? r
          : {
              size: r.size,
              bust: Number((r.bust / 2.54).toFixed(1)),
              waist: Number((r.waist / 2.54).toFixed(1)),
              hip: Number((r.hip / 2.54).toFixed(1)),
            },
      ),
    [unit],
  );
  if (!ready) return <div className="mt-8 h-56 rounded-xl border border-line bg-surface" />;
  return (
    <ChartShell kicker={`Size progression · midpoints, ${unit}`} tall>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
          <CartesianGrid stroke="var(--color-line)" vertical={false} />
          <XAxis dataKey="size" stroke="var(--color-subtle)" tick={{ fill: "var(--color-fg)" }} />
          <YAxis stroke="var(--color-subtle)" tick={{ fill: "var(--color-muted)", fontSize: 11 }} />
          <Tooltip contentStyle={tooltipStyle} />
          <Legend wrapperStyle={{ fontSize: 11, color: "var(--color-muted)" }} />
          <Line type="monotone" dataKey="bust" name="Bust" stroke="var(--color-accent)" strokeWidth={2} dot={{ r: 4 }} />
          <Line type="monotone" dataKey="waist" name="Waist" stroke="var(--color-blush)" strokeWidth={2} dot={{ r: 4 }} />
          <Line type="monotone" dataKey="hip" name="Hip" stroke="var(--color-muted)" strokeWidth={2} dot={{ r: 4 }} />
        </LineChart>
      </ResponsiveContainer>
    </ChartShell>
  );
}

export function SilhouetteRadar() {
  const ready = useChartReady();
  const [size, setSize] = useState("M");
  const data = silhouetteFor(size);
  if (!ready) return <div className="mt-8 h-72 rounded-xl border border-line bg-surface" />;
  return (
    <div className="mt-8 rounded-xl border border-line bg-surface p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-2xs uppercase tracking-widest text-accent">Silhouette vs house M</p>
        <div className="flex flex-wrap gap-1">
          {ALPHA_ROWS.map((r) => (
            <button
              key={r.size}
              type="button"
              onClick={() => setSize(r.size)}
              className={`h-11 min-w-11 rounded-full border px-3 text-2xs uppercase tracking-widest ${
                size === r.size ? "border-accent bg-accent text-accent-fg" : "border-line text-muted"
              }`}
            >
              {r.size}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-3 h-72">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={data} cx="50%" cy="50%" outerRadius="70%">
            <PolarGrid stroke="var(--color-line)" />
            <PolarAngleAxis dataKey="metric" tick={{ fill: "var(--color-muted)", fontSize: 12 }} />
            <PolarRadiusAxis domain={[50, 125]} tick={{ fill: "var(--color-subtle)", fontSize: 10 }} />
            <Radar name="M" dataKey="house" stroke="var(--color-muted)" fill="var(--color-muted)" fillOpacity={0.12} />
            <Radar name={size} dataKey="size" stroke="var(--color-accent)" fill="var(--color-accent)" fillOpacity={0.28} />
            <Legend wrapperStyle={{ fontSize: 11, color: "var(--color-muted)" }} />
            <Tooltip contentStyle={tooltipStyle} />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function CupVolumeChart({ unit }: { unit: FitUnit }) {
  const ready = useChartReady();
  const cups = CUP_VOLUME.map((c) =>
    unit === "cm" ? c : { ...c, lo: Number((c.lo / 2.54).toFixed(1)), hi: Number((c.hi / 2.54).toFixed(1)), mid: Number((c.mid / 2.54).toFixed(1)) },
  );
  const bands = BAND_VOLUME.map((b) =>
    unit === "cm" ? b : { ...b, lo: Number((b.lo / 2.54).toFixed(1)), hi: Number((b.hi / 2.54).toFixed(1)), mid: Number((b.mid / 2.54).toFixed(1)) },
  );
  if (!ready) return <div className="mt-8 h-56 rounded-xl border border-line bg-surface" />;
  return (
    <div className="mt-8 grid gap-4 md:grid-cols-2">
      <div className="rounded-xl border border-line bg-surface p-4">
        <p className="text-2xs uppercase tracking-widest text-accent">Cup volume · bust minus band</p>
        <div className="mt-3 h-52">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={cups} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid stroke="var(--color-line)" vertical={false} />
              <XAxis dataKey="cup" stroke="var(--color-subtle)" tick={{ fill: "var(--color-fg)" }} />
              <YAxis domain={unit === "cm" ? [0, 22] : [0, 9]} stroke="var(--color-subtle)" tick={{ fill: "var(--color-muted)", fontSize: 11 }} />
              <Tooltip
                contentStyle={tooltipStyle}
                formatter={(_v, _n, item) => {
                  const row = item?.payload as (typeof cups)[number];
                  return [`${row.lo}–${row.hi} ${unit}`, "Gap"];
                }}
              />
              <Bar dataKey="mid" fill="var(--color-accent)" radius={[8, 8, 0, 0]} maxBarSize={48} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="rounded-xl border border-line bg-surface p-4">
        <p className="text-2xs uppercase tracking-widest text-accent">Band · underbust {unit}</p>
        <div className="mt-3 h-52">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={bands} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid stroke="var(--color-line)" vertical={false} />
              <XAxis dataKey="band" stroke="var(--color-subtle)" tick={{ fill: "var(--color-fg)" }} />
              <YAxis domain={unit === "cm" ? [60, 100] : [24, 40]} stroke="var(--color-subtle)" tick={{ fill: "var(--color-muted)", fontSize: 11 }} />
              <Tooltip
                contentStyle={tooltipStyle}
                formatter={(_v, _n, item) => {
                  const row = item?.payload as (typeof bands)[number];
                  return [`${row.lo}–${row.hi} ${unit}`, "Underbust"];
                }}
              />
              <Bar dataKey="mid" fill="var(--color-blush)" radius={[8, 8, 0, 0]} maxBarSize={36} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export function BraHeat() {
  return (
    <div className="mt-8 overflow-x-auto">
      <div className="grid gap-1" style={{ gridTemplateColumns: "3.5rem repeat(4, minmax(3.5rem, 1fr))" }}>
        <div />
        {BRA_CUPS_CUT.map((c) => (
          <div key={c} className="py-2 text-center text-2xs uppercase tracking-widest text-accent">
            {c}
          </div>
        ))}
        {BRA_BANDS_CUT.map((band) => (
          <div key={band} className="contents">
            <div className="flex items-center text-sm font-medium text-fg">{band}</div>
            {BRA_CUPS_CUT.map((cup) => {
              const on = braIsCut(band, cup);
              return (
                <div
                  key={cup}
                  className={`grid h-14 place-items-center rounded-md border text-xs ${
                    on ? "border-accent/50 bg-accent/20 text-accent" : "border-line bg-elevated text-subtle"
                  }`}
                >
                  {on ? `${band}${cup}` : "—"}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

export function SisterChains() {
  return (
    <div className="mt-6 space-y-3">
      {SISTER_SIZES.map((row) => (
        <div key={row[0]} className="flex flex-wrap items-center gap-2">
          {row.map((size, i) => (
            <span key={size} className="flex items-center gap-2">
              {i > 0 && <span className="h-px w-6 bg-accent/50" />}
              <span className="inline-flex h-11 min-w-11 items-center justify-center rounded-full border border-line px-3 text-xs text-fg">
                {size}
              </span>
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}

export function ConvertChart() {
  const ready = useChartReady();
  if (!ready) return <div className="mt-8 h-72 rounded-xl border border-line bg-surface" />;
  return (
    <ChartShell kicker="Dress numbers · UK / US / EU / AU" tall>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={[...INT_DRESS]} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid stroke="var(--color-line)" vertical={false} />
          <XAxis dataKey="size" stroke="var(--color-subtle)" tick={{ fill: "var(--color-fg)" }} />
          <YAxis stroke="var(--color-subtle)" tick={{ fill: "var(--color-muted)", fontSize: 11 }} />
          <Tooltip contentStyle={tooltipStyle} />
          <Legend wrapperStyle={{ fontSize: 11, color: "var(--color-muted)" }} />
          <Bar dataKey="UK" fill="var(--color-accent)" radius={[6, 6, 0, 0]} maxBarSize={18} />
          <Bar dataKey="US" fill="var(--color-blush)" radius={[6, 6, 0, 0]} maxBarSize={18} />
          <Bar dataKey="EU" fill="var(--color-muted)" radius={[6, 6, 0, 0]} maxBarSize={18} />
          <Bar dataKey="AU" fill="var(--color-ok)" radius={[6, 6, 0, 0]} maxBarSize={18} />
        </BarChart>
      </ResponsiveContainer>
    </ChartShell>
  );
}

export function CorsetChart() {
  const ready = useChartReady();
  if (!ready) return <div className="mt-8 h-64 rounded-xl border border-line bg-surface" />;
  return (
    <ChartShell kicker="Open waist vs laced closed, cm" tall>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={CORSET_CHART} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid stroke="var(--color-line)" vertical={false} />
          <XAxis dataKey="size" stroke="var(--color-subtle)" tick={{ fill: "var(--color-fg)" }} />
          <YAxis domain={[50, 110]} stroke="var(--color-subtle)" tick={{ fill: "var(--color-muted)", fontSize: 11 }} />
          <Tooltip contentStyle={tooltipStyle} />
          <Legend wrapperStyle={{ fontSize: 11, color: "var(--color-muted)" }} />
          <Bar dataKey="rib" name="Rib" fill="var(--color-muted)" radius={[6, 6, 0, 0]} maxBarSize={22} />
          <Bar dataKey="open" name="Open waist" fill="var(--color-blush)" radius={[6, 6, 0, 0]} maxBarSize={22} />
          <Bar dataKey="closed" name="Laced closed" fill="var(--color-accent)" radius={[6, 6, 0, 0]} maxBarSize={22} />
        </BarChart>
      </ResponsiveContainer>
    </ChartShell>
  );
}

export function HoseChart() {
  const ready = useChartReady();
  if (!ready) return <div className="mt-8 h-64 rounded-xl border border-line bg-surface" />;
  return (
    <div className="mt-8 grid gap-4 md:grid-cols-2">
      <div className="rounded-xl border border-line bg-surface p-4">
        <p className="text-2xs uppercase tracking-widest text-accent">Height range, cm</p>
        <div className="mt-3 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart layout="vertical" data={HOSE_CHART} margin={{ top: 8, right: 12, left: 8, bottom: 8 }} barCategoryGap={12}>
              <CartesianGrid stroke="var(--color-line)" horizontal={false} />
              <XAxis type="number" domain={[145, 185]} stroke="var(--color-subtle)" tick={{ fill: "var(--color-muted)", fontSize: 11 }} />
              <YAxis type="category" dataKey="size" width={40} stroke="var(--color-subtle)" tick={{ fill: "var(--color-fg)", fontSize: 12 }} />
              <Tooltip
                contentStyle={tooltipStyle}
                formatter={(_v, _n, item) => {
                  const row = item?.payload as (typeof HOSE_CHART)[number];
                  return [`${row.heightOff}–${row.heightHi} cm`, "Height"];
                }}
              />
              <Bar dataKey="heightOff" stackId="h" fill="transparent" isAnimationActive={false} />
              <Bar dataKey="height" stackId="h" fill="var(--color-accent)" radius={[99, 99, 99, 99]} maxBarSize={14} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="rounded-xl border border-line bg-surface p-4">
        <p className="text-2xs uppercase tracking-widest text-accent">Thigh range, cm</p>
        <div className="mt-3 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart layout="vertical" data={HOSE_CHART} margin={{ top: 8, right: 12, left: 8, bottom: 8 }} barCategoryGap={12}>
              <CartesianGrid stroke="var(--color-line)" horizontal={false} />
              <XAxis type="number" domain={[44, 76]} stroke="var(--color-subtle)" tick={{ fill: "var(--color-muted)", fontSize: 11 }} />
              <YAxis type="category" dataKey="size" width={40} stroke="var(--color-subtle)" tick={{ fill: "var(--color-fg)", fontSize: 12 }} />
              <Tooltip
                contentStyle={tooltipStyle}
                formatter={(_v, _n, item) => {
                  const row = item?.payload as (typeof HOSE_CHART)[number];
                  return [`${row.thighOff}–${row.thighHi} cm`, "Thigh"];
                }}
              />
              <Bar dataKey="thighOff" stackId="t" fill="transparent" isAnimationActive={false} />
              <Bar dataKey="thigh" stackId="t" fill="var(--color-blush)" radius={[99, 99, 99, 99]} maxBarSize={14} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export function GownChart() {
  const ready = useChartReady();
  if (!ready) return <div className="mt-8 h-64 rounded-xl border border-line bg-surface" />;
  return (
    <ChartShell kicker="Centre-back length vs floor height, cm">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={GOWN_CHART} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
          <CartesianGrid stroke="var(--color-line)" vertical={false} />
          <XAxis dataKey="size" stroke="var(--color-subtle)" tick={{ fill: "var(--color-fg)" }} />
          <YAxis yAxisId="len" domain={[140, 155]} stroke="var(--color-subtle)" tick={{ fill: "var(--color-muted)", fontSize: 11 }} />
          <YAxis yAxisId="ht" orientation="right" domain={[160, 180]} stroke="var(--color-subtle)" tick={{ fill: "var(--color-muted)", fontSize: 11 }} />
          <Tooltip contentStyle={tooltipStyle} />
          <Legend wrapperStyle={{ fontSize: 11, color: "var(--color-muted)" }} />
          <Line yAxisId="len" type="monotone" dataKey="length" name="Hem cm" stroke="var(--color-accent)" strokeWidth={2} dot={{ r: 4 }} />
          <Line yAxisId="ht" type="monotone" dataKey="height" name="Floor height cm" stroke="var(--color-blush)" strokeWidth={2} dot={{ r: 4 }} />
        </LineChart>
      </ResponsiveContainer>
    </ChartShell>
  );
}

export function NightyChart() {
  const ready = useChartReady();
  if (!ready) return <div className="mt-8 h-56 rounded-xl border border-line bg-surface" />;
  return (
    <ChartShell kicker="Nighty length vs bust midpoint, cm">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={NIGHTY_CHART} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
          <CartesianGrid stroke="var(--color-line)" vertical={false} />
          <XAxis dataKey="size" stroke="var(--color-subtle)" tick={{ fill: "var(--color-fg)" }} />
          <YAxis yAxisId="len" domain={[78, 92]} stroke="var(--color-subtle)" tick={{ fill: "var(--color-muted)", fontSize: 11 }} />
          <YAxis yAxisId="bust" orientation="right" domain={[80, 110]} stroke="var(--color-subtle)" tick={{ fill: "var(--color-muted)", fontSize: 11 }} />
          <Tooltip contentStyle={tooltipStyle} />
          <Legend wrapperStyle={{ fontSize: 11, color: "var(--color-muted)" }} />
          <Line yAxisId="len" type="monotone" dataKey="length" name="Length cm" stroke="var(--color-accent)" strokeWidth={2} dot={{ r: 4 }} />
          <Line yAxisId="bust" type="monotone" dataKey="bust" name="Bust cm" stroke="var(--color-blush)" strokeWidth={2} dot={{ r: 4 }} />
        </LineChart>
      </ResponsiveContainer>
    </ChartShell>
  );
}

const FIELDS = [
  { key: "under", label: "Underbust" },
  { key: "bust", label: "Bust" },
  { key: "waist", label: "Waist" },
  { key: "hip", label: "Hip" },
  { key: "height", label: "Height" },
  { key: "thigh", label: "Thigh" },
] as const;

export function FitFinder({ unit, onUnit }: { unit: FitUnit; onUnit: (u: FitUnit) => void }) {
  const [vals, setVals] = useState<Record<(typeof FIELDS)[number]["key"], string>>({
    under: "",
    bust: "",
    waist: "",
    hip: "",
    height: "",
    thigh: "",
  });
  const result: FitResult = useMemo(() => {
    const num = (k: (typeof FIELDS)[number]["key"]) => {
      const n = Number(vals[k]);
      return vals[k] && Number.isFinite(n) ? n : undefined;
    };
    return recommendFit({
      unit,
      under: num("under"),
      bust: num("bust"),
      waist: num("waist"),
      hip: num("hip"),
      height: num("height"),
      thigh: num("thigh"),
    });
  }, [unit, vals]);

  const pieces = [
    { key: "bra", label: "Bra" },
    { key: "body", label: "Body" },
    { key: "nighty", label: "Nighty" },
    { key: "gown", label: "Gown" },
    { key: "corset", label: "Corset" },
    { key: "hose", label: "Hosiery" },
  ] as const;

  const filled = pieces.filter((p) => result[p.key]);

  return (
    <div className="mt-8 rounded-xl border border-line bg-surface p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-2xs uppercase tracking-widest text-accent">Tape, then read</p>
        <UnitToggle unit={unit} onChange={onUnit} />
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {FIELDS.map((f) => (
          <label key={f.key} className="block">
            <span className="text-2xs uppercase tracking-widest text-muted">
              {f.label} ({unit})
            </span>
            <input
              type="number"
              inputMode="decimal"
              min={0}
              step={unit === "cm" ? 1 : 0.5}
              value={vals[f.key]}
              onChange={(e) => setVals((v) => ({ ...v, [f.key]: e.target.value }))}
              className="mt-2 h-11 w-full min-w-0 max-w-full rounded-full border border-line bg-elevated px-4 text-sm text-fg"
            />
          </label>
        ))}
      </div>
      {filled.length === 0 ? (
        <p className="mt-6 text-sm text-subtle">Enter underbust and bust for a bra; waist and hip for body; height for hose.</p>
      ) : (
        <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filled.map((p) => {
            const piece = result[p.key]!;
            return (
              <li key={p.key} className="rounded-lg border border-line bg-elevated p-4">
                <p className="text-2xs uppercase tracking-widest text-accent">{p.label}</p>
                <p className="mt-1 font-display text-3xl italic text-fg">{piece.size}</p>
                {piece.sisters && piece.sisters.length > 0 && (
                  <p className="mt-1 text-xs text-muted">Sisters {piece.sisters.join(" · ")}</p>
                )}
                <p className="mt-2 text-sm text-subtle">{piece.note}</p>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
