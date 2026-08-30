import { createFileRoute, Link } from "@tanstack/react-router";
import { BodyRangeChart, BraHeat, CupVolumeChart, MeasureFigures, SisterChains } from "@/components/size-visuals";
import {
  AISLE_CHARTS,
  ALPHA_ROWS,
  BRA_MATRIX,
  CHART_COPY,
  CORSET_ROWS,
  EXTRA_NAV,
  GOWN_ROWS,
  GUIDE_STEPS,
  HOSE_ROWS,
  NIGHTY_ROWS,
  PANTIES_ROWS,
  SWIM_ROWS,
} from "@/lib/size-guide";

export const Route = createFileRoute("/size-guide")({ component: SizeGuide });

function ChartTable({
  columns,
  rows,
}: {
  columns: string[];
  rows: Array<Array<string | number>>;
}) {
  return (
    <div className="mt-8 overflow-x-auto">
      <table className="w-full border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-line text-2xs uppercase tracking-widest text-accent">
            {columns.map((c) => (
              <th key={c} className="whitespace-nowrap py-3 pr-4 font-medium">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-line/70">
              {row.map((cell, j) => (
                <td key={j} className={`whitespace-nowrap py-3 pr-4 ${j === 0 ? "font-medium text-fg" : "text-muted"}`}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SizeGuide() {
  const nav = [...Object.values(CHART_COPY), ...EXTRA_NAV];

  return (
    <main>
      <section className="mx-auto max-w-6xl px-4 pt-12 pb-6">
        <p className="text-xs uppercase tracking-[0.28em] text-accent">Atelier fittings</p>
        <h1 className="mt-2 font-display text-5xl italic text-fg md:text-6xl">Size charts</h1>
        <p className="mt-4 max-w-lg text-muted">
          Figures, heat maps, and range bars — then the numbers. Stock is per size.
        </p>
      </section>

      <nav className="sticky top-16 z-20 border-y border-accent/20 bg-bg/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl gap-2 overflow-x-auto px-4 py-3">
          <a
            href="#visuals"
            className="inline-flex h-11 shrink-0 items-center rounded-full border border-accent bg-accent px-4 text-2xs uppercase tracking-wider text-accent-fg"
          >
            Visuals
          </a>
          {nav.map((c) => (
            <a
              key={c.id}
              href={`#${c.id}`}
              className="inline-flex h-11 shrink-0 items-center rounded-full border border-line px-4 text-2xs uppercase tracking-wider text-muted hover:border-accent hover:text-accent"
            >
              {c.kicker}
            </a>
          ))}
        </div>
      </nav>

      <div className="mx-auto max-w-6xl px-4 py-10">
        <section id="visuals" className="scroll-mt-32">
          <p className="text-xs uppercase tracking-[0.24em] text-accent">Visual charts</p>
          <h2 className="mt-2 font-display text-3xl italic text-fg">Where the tape sits</h2>
          <MeasureFigures />
          <p className="mt-12 text-xs uppercase tracking-[0.24em] text-accent">Cups we cut</p>
          <h2 className="mt-2 font-display text-3xl italic text-fg">Bra map</h2>
          <BraHeat />
          <CupVolumeChart />
          <p className="mt-12 text-xs uppercase tracking-[0.24em] text-accent">XS to XXL</p>
          <h2 className="mt-2 font-display text-3xl italic text-fg">Body ranges</h2>
          <BodyRangeChart />
        </section>

        <section className="pt-16">
          <p className="text-xs uppercase tracking-[0.24em] text-accent">How to measure</p>
          <h2 className="mt-2 font-display text-3xl italic text-fg">Tape, then choose</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {GUIDE_STEPS.map((step, i) => (
              <article key={step.title} className="rounded-xl border border-line bg-surface p-5">
                <p className="text-2xs uppercase tracking-[0.2em] text-accent">0{i + 1}</p>
                <h3 className="mt-2 font-display text-2xl italic text-fg">{step.title}</h3>
                <p className="mt-2 text-sm text-muted">{step.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="bras" className="scroll-mt-32 pt-16">
          <p className="text-xs uppercase tracking-[0.24em] text-accent">{CHART_COPY.bra.kicker}</p>
          <h2 className="mt-2 font-display text-3xl italic text-fg">{CHART_COPY.bra.title}</h2>
          <p className="mt-3 max-w-xl text-muted">{CHART_COPY.bra.body}</p>
          <ChartTable
            columns={["Size", "Underbust cm", "Underbust in", "Bust cm", "Bust in"]}
            rows={BRA_MATRIX.map((r) => [r.size, r.underCm, r.underIn, r.bustCm, r.bustIn])}
          />

          <p className="mt-8 text-2xs uppercase tracking-widest text-accent">Sister sizes</p>
          <p className="mt-2 max-w-xl text-sm text-muted">
            Same cup volume, neighbouring band. If a 34C is gone, try 32D (tighter band) or 36B (looser band).
          </p>
          <SisterChains />
          <p className="mt-4 text-sm text-subtle">Example: underbust 75 cm and bust 91 cm → 34C.</p>
        </section>

        <section id="body" className="scroll-mt-32 pt-16">
          <p className="text-xs uppercase tracking-[0.24em] text-accent">{CHART_COPY.alpha.kicker}</p>
          <h2 className="mt-2 font-display text-3xl italic text-fg">{CHART_COPY.alpha.title}</h2>
          <p className="mt-3 max-w-xl text-muted">{CHART_COPY.alpha.body}</p>
          <ChartTable
            columns={["Size", "Bust cm", "Waist cm", "Hip cm", "Bust in", "Waist in", "Hip in", "UK", "US", "EU"]}
            rows={ALPHA_ROWS.map((r) => [r.size, r.bust, r.waist, r.hip, r.bustIn, r.waistIn, r.hipIn, r.uk, r.us, r.eu])}
          />
          <p className="mt-8 text-2xs uppercase tracking-widest text-accent">Panties</p>
          <ChartTable
            columns={["Size", "Hip cm", "Waist cm"]}
            rows={PANTIES_ROWS.map((r) => [r.size, r.hip, r.waist])}
          />
        </section>

        <section id="night" className="scroll-mt-32 pt-16">
          <p className="text-xs uppercase tracking-[0.24em] text-accent">{CHART_COPY.nighty.kicker}</p>
          <h2 className="mt-2 font-display text-3xl italic text-fg">{CHART_COPY.nighty.title}</h2>
          <p className="mt-3 max-w-xl text-muted">{CHART_COPY.nighty.body}</p>
          <ChartTable
            columns={["Size", "Bust cm", "Waist cm", "Hip cm", "Length cm", "Note"]}
            rows={NIGHTY_ROWS.map((r) => [r.size, r.bust, r.waist, r.hip, r.length, r.note])}
          />
        </section>

        <section id="gowns" className="scroll-mt-32 pt-16">
          <p className="text-xs uppercase tracking-[0.24em] text-accent">{CHART_COPY.gown.kicker}</p>
          <h2 className="mt-2 font-display text-3xl italic text-fg">{CHART_COPY.gown.title}</h2>
          <p className="mt-3 max-w-xl text-muted">{CHART_COPY.gown.body}</p>
          <ChartTable
            columns={["Size", "Bust cm", "Waist cm", "Hip cm", "Length cm", "Note"]}
            rows={GOWN_ROWS.map((r) => [r.size, r.bust, r.waist, r.hip, r.length, r.note])}
          />
        </section>

        <section id="corset" className="scroll-mt-32 pt-16">
          <p className="text-xs uppercase tracking-[0.24em] text-accent">Waspie & bustier</p>
          <h2 className="mt-2 font-display text-3xl italic text-fg">Corsetry</h2>
          <p className="mt-3 max-w-xl text-muted">
            Closed is the laced waist. Open is the rib before lacing. Hourglass, not squeeze — do not size down more than 4 cm.
          </p>
          <ChartTable
            columns={["Size", "Waist closed cm", "Waist open cm", "Rib cm"]}
            rows={CORSET_ROWS.map((r) => [r.size, r.waistClosed, r.waistOpen, r.rib])}
          />
        </section>

        <section id="hose" className="scroll-mt-32 pt-16">
          <p className="text-xs uppercase tracking-[0.24em] text-accent">Hold-ups & seamed</p>
          <h2 className="mt-2 font-display text-3xl italic text-fg">Hosiery</h2>
          <p className="mt-3 max-w-xl text-muted">Height, inside leg, and thigh. If between, take the larger for the welt.</p>
          <ChartTable
            columns={["Size", "Height cm", "Inseam cm", "Thigh cm"]}
            rows={HOSE_ROWS.map((r) => [r.size, r.height, r.inseam, r.thigh])}
          />
        </section>

        <section id="swim" className="scroll-mt-32 pt-16">
          <p className="text-xs uppercase tracking-[0.24em] text-accent">Bikini</p>
          <h2 className="mt-2 font-display text-3xl italic text-fg">Swim</h2>
          <p className="mt-3 max-w-xl text-muted">Triangle tops follow hip for the brief, nearest cup for the top.</p>
          <ChartTable
            columns={["Size", "Bust cm", "Hip cm", "Nearest cup"]}
            rows={SWIM_ROWS.map((r) => [r.size, r.bust, r.hip, r.cup])}
          />
        </section>

        <section id="free" className="scroll-mt-32 pt-16">
          <p className="text-xs uppercase tracking-[0.24em] text-accent">{CHART_COPY.free.kicker}</p>
          <h2 className="mt-2 font-display text-3xl italic text-fg">{CHART_COPY.free.title}</h2>
          <p className="mt-3 max-w-xl text-muted">{CHART_COPY.free.body}</p>
          <ChartTable
            columns={["Piece", "Fits", "Note"]}
            rows={[
              ["Body stocking", "S–XL", "Stretch lace, one piece"],
              ["Sarong", "S–XXL", "Tie at the hip"],
              ["Silk mask", "All", "Adjustable strap"],
              ["Body chain", "S–L", "Clasp at the nape"],
            ]}
          />
        </section>

        <section className="pt-16">
          <p className="text-xs uppercase tracking-[0.24em] text-accent">By aisle</p>
          <h2 className="mt-2 font-display text-3xl italic text-fg">Which chart to use</h2>
          <ul className="mt-6 grid gap-2 sm:grid-cols-2">
            {AISLE_CHARTS.map((row) => (
              <li key={row.aisle} className="flex items-center justify-between gap-4 border-b border-line py-3">
                <Link to="/shop" search={{ cat: row.aisle }} className="text-sm text-fg hover:text-accent">
                  {row.aisle}
                </Link>
                <a href={row.href} className="text-xs uppercase tracking-wider text-muted hover:text-accent">
                  {row.chart}
                </a>
              </li>
            ))}
          </ul>
        </section>

        <p className="mt-12 text-sm text-subtle">
          Between sizes? Write{" "}
          <a className="text-accent" href="mailto:info@silkmoments.com">
            info@silkmoments.com
          </a>
          . Returns are not offered on worn pieces — measure first.
        </p>
      </div>
    </main>
  );
}
