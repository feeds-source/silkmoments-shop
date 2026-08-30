import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  BAND_VOLUME,
  BODY_RANGE,
  BRA_BANDS_CUT,
  BRA_CUPS_CUT,
  CUP_VOLUME,
  MEASURE_MARKS,
  SISTER_SIZES,
  braIsCut,
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

export function BodyRangeChart() {
  const ready = useChartReady();
  if (!ready) return <div className="mt-8 h-72 rounded-xl border border-line bg-surface" />;
  return (
    <div className="mt-8 rounded-xl border border-line bg-surface p-4">
      <p className="text-2xs uppercase tracking-widest text-accent">Bust · waist · hip, cm</p>
      <div className="mt-3 h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart layout="vertical" data={BODY_RANGE} margin={{ top: 8, right: 12, left: 8, bottom: 8 }} barCategoryGap={10}>
            <CartesianGrid stroke="var(--color-line)" horizontal={false} />
            <XAxis type="number" domain={[55, 125]} stroke="var(--color-subtle)" tick={{ fill: "var(--color-muted)", fontSize: 11 }} />
            <YAxis type="category" dataKey="size" stroke="var(--color-subtle)" tick={{ fill: "var(--color-fg)", fontSize: 12 }} width={40} />
            <Tooltip
              contentStyle={tooltipStyle}
              formatter={(value, name, item) => {
                const row = item?.payload as (typeof BODY_RANGE)[number] | undefined;
                if (!row) return [String(value), String(name)];
                if (name === "bust") return [`${row.bustOff}–${row.bustHi} cm`, "Bust"];
                if (name === "waist") return [`${row.waistOff}–${row.waistHi} cm`, "Waist"];
                if (name === "hip") return [`${row.hipOff}–${row.hipHi} cm`, "Hip"];
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

export function CupVolumeChart() {
  const ready = useChartReady();
  if (!ready) return <div className="mt-8 h-56 rounded-xl border border-line bg-surface" />;
  return (
    <div className="mt-8 grid gap-4 md:grid-cols-2">
      <div className="rounded-xl border border-line bg-surface p-4">
        <p className="text-2xs uppercase tracking-widest text-accent">Cup volume · bust minus band</p>
        <div className="mt-3 h-52">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={CUP_VOLUME} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid stroke="var(--color-line)" vertical={false} />
              <XAxis dataKey="cup" stroke="var(--color-subtle)" tick={{ fill: "var(--color-fg)" }} />
              <YAxis domain={[0, 22]} stroke="var(--color-subtle)" tick={{ fill: "var(--color-muted)", fontSize: 11 }} unit=" cm" />
              <Tooltip contentStyle={tooltipStyle} formatter={(v, _n, item) => {
                const row = item?.payload as (typeof CUP_VOLUME)[number];
                return [`${row.lo}–${row.hi} cm`, "Gap"];
              }} />
              <Bar dataKey="mid" fill="var(--color-accent)" radius={[8, 8, 0, 0]} maxBarSize={48} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="rounded-xl border border-line bg-surface p-4">
        <p className="text-2xs uppercase tracking-widest text-accent">Band · underbust cm</p>
        <div className="mt-3 h-52">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={BAND_VOLUME} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid stroke="var(--color-line)" vertical={false} />
              <XAxis dataKey="band" stroke="var(--color-subtle)" tick={{ fill: "var(--color-fg)" }} />
              <YAxis domain={[60, 100]} stroke="var(--color-subtle)" tick={{ fill: "var(--color-muted)", fontSize: 11 }} />
              <Tooltip contentStyle={tooltipStyle} formatter={(v, _n, item) => {
                const row = item?.payload as (typeof BAND_VOLUME)[number];
                return [`${row.lo}–${row.hi} cm`, "Underbust"];
              }} />
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
