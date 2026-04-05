import { type Category } from "@/types";

// Rich sectional detail drawings by category — each shows layered materials,
// hatching, numbered callouts, and a legend, seeded by detail id for variation.
export function BlurredDetailPreview({
  category,
  seed = "default",
  blurred = true,
}: {
  category: string;
  seed?: string;
  blurred?: boolean;
}) {
  const rng = makeRng(seed);
  const svgContent = getDetailSvg(category as Category, rng, seed);

  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[#f5f7ff]" />
      <div
        className="absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(59,91,255,0.12) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59,91,255,0.12) 1px, transparent 1px)
          `,
          backgroundSize: "20px 20px",
        }}
      />
      <div
        className="absolute inset-0 flex items-center justify-center p-4"
        style={blurred ? { filter: "blur(6px)" } : undefined}
      >
        {svgContent}
      </div>
      {blurred && (
        <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-white/40" />
      )}
    </div>
  );
}

// Deterministic seeded RNG
function makeRng(seed: string) {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return () => {
    h ^= h << 13;
    h ^= h >>> 17;
    h ^= h << 5;
    return ((h >>> 0) % 10000) / 10000;
  };
}

type Rng = () => number;
const rand = (r: Rng, min: number, max: number) => min + r() * (max - min);
const randInt = (r: Rng, min: number, max: number) => Math.floor(rand(r, min, max + 1));

const STROKE = "#1a3dcc";

// --- Shared SVG helpers ------------------------------------------------------

function Defs({ uid }: { uid: string }) {
  return (
    <defs>
      <pattern
        id={`diag-${uid}`}
        width="5"
        height="5"
        patternUnits="userSpaceOnUse"
        patternTransform="rotate(45)"
      >
        <line x1="0" y1="0" x2="0" y2="5" stroke={STROKE} strokeWidth="0.5" />
      </pattern>
      <pattern
        id={`concrete-${uid}`}
        width="10"
        height="10"
        patternUnits="userSpaceOnUse"
      >
        <circle cx="2" cy="3" r="0.6" fill={STROKE} />
        <circle cx="7" cy="7" r="0.5" fill={STROKE} />
        <circle cx="5" cy="1" r="0.4" fill={STROKE} />
        <path d="M 0 0 L 2 2" stroke={STROKE} strokeWidth="0.3" />
        <path d="M 6 4 L 8 6" stroke={STROKE} strokeWidth="0.3" />
      </pattern>
      <pattern
        id={`insul-${uid}`}
        width="12"
        height="6"
        patternUnits="userSpaceOnUse"
      >
        <path
          d="M 0 3 Q 3 0 6 3 T 12 3"
          stroke={STROKE}
          strokeWidth="0.6"
          fill="none"
        />
      </pattern>
      <pattern
        id={`soil-${uid}`}
        width="14"
        height="14"
        patternUnits="userSpaceOnUse"
      >
        <circle cx="2" cy="4" r="0.9" fill={STROKE} />
        <circle cx="9" cy="9" r="0.7" fill={STROKE} />
        <circle cx="6" cy="2" r="0.5" fill={STROKE} />
        <circle cx="12" cy="5" r="0.6" fill={STROKE} />
      </pattern>
      <pattern
        id={`wood-${uid}`}
        width="8"
        height="8"
        patternUnits="userSpaceOnUse"
      >
        <path d="M 0 2 Q 4 0 8 2" stroke={STROKE} strokeWidth="0.4" fill="none" />
        <path d="M 0 6 Q 4 4 8 6" stroke={STROKE} strokeWidth="0.4" fill="none" />
      </pattern>
      <pattern
        id={`gravel-${uid}`}
        width="12"
        height="12"
        patternUnits="userSpaceOnUse"
      >
        <circle cx="3" cy="3" r="1.5" fill="none" stroke={STROKE} strokeWidth="0.4" />
        <circle cx="9" cy="8" r="1.8" fill="none" stroke={STROKE} strokeWidth="0.4" />
        <circle cx="6" cy="10" r="1.2" fill="none" stroke={STROKE} strokeWidth="0.4" />
      </pattern>
    </defs>
  );
}

function Callout({
  n,
  x,
  y,
  lx,
  ly,
}: {
  n: number;
  x: number;
  y: number;
  lx: number;
  ly: number;
}) {
  return (
    <g>
      <line x1={x} y1={y} x2={lx} y2={ly} stroke={STROKE} strokeWidth="0.7" />
      <circle cx={lx} cy={ly} r="7" fill="white" stroke={STROKE} strokeWidth="1.1" />
      <text
        x={lx}
        y={ly + 3}
        textAnchor="middle"
        fontSize="9"
        fill={STROKE}
        fontWeight="700"
        fontFamily="sans-serif"
      >
        {n}
      </text>
    </g>
  );
}

function Legend({
  items,
  x,
  y,
}: {
  items: string[];
  x: number;
  y: number;
}) {
  return (
    <g fontFamily="sans-serif">
      {items.map((label, i) => (
        <text key={i} x={x} y={y + i * 11} fontSize="7" fill={STROKE}>
          {i + 1}. {label}
        </text>
      ))}
    </g>
  );
}

function DimLine({
  x1,
  y1,
  x2,
  y2,
  label,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  label?: string;
}) {
  const midX = (x1 + x2) / 2;
  const midY = (y1 + y2) / 2;
  return (
    <g>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={STROKE} strokeWidth="0.5" />
      <line x1={x1} y1={y1 - 3} x2={x1} y2={y1 + 3} stroke={STROKE} strokeWidth="0.5" />
      <line x1={x2} y1={y2 - 3} x2={x2} y2={y2 + 3} stroke={STROKE} strokeWidth="0.5" />
      {label && (
        <text
          x={midX}
          y={midY - 3}
          textAnchor="middle"
          fontSize="6"
          fill={STROKE}
          fontFamily="sans-serif"
        >
          {label}
        </text>
      )}
    </g>
  );
}

// --- Category drawings -------------------------------------------------------

function getDetailSvg(category: Category, r: Rng, uid: string) {
  const vb = "0 0 400 400";
  const cls = "w-full h-full";
  const xmlns = "http://www.w3.org/2000/svg";

  switch (category) {
    case "facade": {
      // Rain screen cladding section
      const panelCount = randInt(r, 4, 6);
      const panelH = 260 / panelCount;
      return (
        <svg viewBox={vb} className={cls} xmlns={xmlns}>
          <Defs uid={uid} />
          {/* Interior gypsum */}
          <rect x="40" y="60" width="18" height="260" fill={`url(#diag-${uid})`} stroke={STROKE} strokeWidth="1" />
          {/* Stud cavity with insulation */}
          <rect x="58" y="60" width="50" height="260" fill={`url(#insul-${uid})`} stroke={STROKE} strokeWidth="1" />
          {/* Stud */}
          <rect x="70" y="60" width="12" height="260" fill={`url(#wood-${uid})`} stroke={STROKE} strokeWidth="1" />
          <rect x="88" y="60" width="12" height="260" fill={`url(#wood-${uid})`} stroke={STROKE} strokeWidth="1" />
          {/* Sheathing */}
          <rect x="108" y="60" width="8" height="260" fill={`url(#wood-${uid})`} stroke={STROKE} strokeWidth="1" />
          {/* Air/vapor barrier line */}
          <line x1="116" y1="60" x2="116" y2="320" stroke={STROKE} strokeWidth="1.5" strokeDasharray="4,2" />
          {/* Continuous insulation */}
          <rect x="116" y="60" width="24" height="260" fill={`url(#diag-${uid})`} stroke={STROKE} strokeWidth="1" />
          {/* Subframe rails */}
          <rect x="140" y="60" width="16" height="260" fill="none" stroke={STROKE} strokeWidth="1" />
          <line x1="148" y1="60" x2="148" y2="320" stroke={STROKE} strokeWidth="1" />
          {/* Clips */}
          <rect x="140" y="100" width="20" height="6" fill={STROKE} />
          <rect x="140" y="180" width="20" height="6" fill={STROKE} />
          <rect x="140" y="260" width="20" height="6" fill={STROKE} />
          {/* Air gap */}
          <line x1="160" y1="60" x2="160" y2="320" stroke={STROKE} strokeWidth="0.5" strokeDasharray="2,2" />
          {/* Cladding panels */}
          {Array.from({ length: panelCount }).map((_, i) => (
            <rect
              key={i}
              x="168"
              y={60 + i * panelH}
              width="22"
              height={panelH - 2}
              fill="none"
              stroke={STROKE}
              strokeWidth="1.2"
            />
          ))}
          {/* Drip edge at base */}
          <polygon points="168,320 190,320 190,332 164,332 164,326" fill={STROKE} />
          {/* Flashing at top */}
          <polygon points="168,60 190,60 190,50 166,50 166,56" fill="none" stroke={STROKE} strokeWidth="1.2" />

          {/* Callouts */}
          <Callout n={1} x={182} y={90} lx={260} ly={70} />
          <Callout n={2} x={150} y={130} lx={260} ly={120} />
          <Callout n={3} x={128} y={170} lx={260} ly={170} />
          <Callout n={4} x={116} y={220} lx={260} ly={220} />
          <Callout n={5} x={80} y={270} lx={260} ly={270} />

          <Legend
            x={275}
            y={72}
            items={[
              "Fiber cement cladding",
              "Aluminum subframe & clips",
              "Continuous mineral wool",
              "Air/vapor barrier membrane",
              "Wood stud with batt insulation",
            ]}
          />
          <DimLine x1={40} y1={345} x2={190} y2={345} label="WALL ASSEMBLY" />
          <text x={40} y={50} fontSize="9" fill={STROKE} fontFamily="sans-serif" fontWeight="700">
            FACADE DETAIL — VENTILATED RAIN SCREEN
          </text>
        </svg>
      );
    }

    case "roofing": {
      // Roof edge / eave section
      const slopeY = randInt(r, 70, 100);
      return (
        <svg viewBox={vb} className={cls} xmlns={xmlns}>
          <Defs uid={uid} />
          {/* Sloped roof assembly */}
          <polygon
            points={`60,${slopeY + 40} 280,${slopeY} 280,${slopeY + 20} 60,${slopeY + 60}`}
            fill={`url(#wood-${uid})`}
            stroke={STROKE}
            strokeWidth="1.2"
          />
          {/* Insulation layer */}
          <polygon
            points={`60,${slopeY + 60} 280,${slopeY + 20} 280,${slopeY + 50} 60,${slopeY + 90}`}
            fill={`url(#diag-${uid})`}
            stroke={STROKE}
            strokeWidth="1"
          />
          {/* Membrane (thick line) */}
          <line
            x1="60"
            y1={slopeY + 40}
            x2="280"
            y2={slopeY}
            stroke={STROKE}
            strokeWidth="2.5"
          />
          {/* Shingles / seam lines */}
          {Array.from({ length: 8 }).map((_, i) => {
            const t = i / 8;
            const x = 60 + t * 220;
            const y = slopeY + 40 - t * 40;
            return (
              <line
                key={i}
                x1={x}
                y1={y}
                x2={x + 4}
                y2={y - 8}
                stroke={STROKE}
                strokeWidth="1"
              />
            );
          })}
          {/* Fascia board */}
          <rect x="40" y={slopeY + 40} width="20" height="60" fill={`url(#wood-${uid})`} stroke={STROKE} strokeWidth="1.2" />
          {/* Gutter */}
          <path
            d={`M 20 ${slopeY + 50} L 20 ${slopeY + 80} Q 20 ${slopeY + 90} 30 ${slopeY + 90} L 40 ${slopeY + 90} L 40 ${slopeY + 50}`}
            fill="none"
            stroke={STROKE}
            strokeWidth="1.5"
          />
          {/* Drip edge */}
          <polygon
            points={`40,${slopeY + 40} 60,${slopeY + 40} 60,${slopeY + 46} 42,${slopeY + 50}`}
            fill={STROKE}
          />
          {/* Soffit vent */}
          <rect x="60" y={slopeY + 95} width="60" height="10" fill="none" stroke={STROKE} strokeWidth="1" />
          <line x1="66" y1={slopeY + 95} x2="66" y2={slopeY + 105} stroke={STROKE} strokeWidth="0.6" />
          <line x1="74" y1={slopeY + 95} x2="74" y2={slopeY + 105} stroke={STROKE} strokeWidth="0.6" />
          <line x1="82" y1={slopeY + 95} x2="82" y2={slopeY + 105} stroke={STROKE} strokeWidth="0.6" />
          <line x1="90" y1={slopeY + 95} x2="90" y2={slopeY + 105} stroke={STROKE} strokeWidth="0.6" />
          <line x1="98" y1={slopeY + 95} x2="98" y2={slopeY + 105} stroke={STROKE} strokeWidth="0.6" />
          <line x1="106" y1={slopeY + 95} x2="106" y2={slopeY + 105} stroke={STROKE} strokeWidth="0.6" />
          <line x1="114" y1={slopeY + 95} x2="114" y2={slopeY + 105} stroke={STROKE} strokeWidth="0.6" />
          {/* Wall below */}
          <rect x="60" y={slopeY + 105} width="20" height="200" fill={`url(#diag-${uid})`} stroke={STROKE} strokeWidth="1" />
          <rect x="80" y={slopeY + 105} width="18" height="200" fill={`url(#insul-${uid})`} stroke={STROKE} strokeWidth="1" />

          <Callout n={1} x={200} y={slopeY + 5} lx={300} ly={40} />
          <Callout n={2} x={180} y={slopeY + 30} lx={300} ly={70} />
          <Callout n={3} x={160} y={slopeY + 55} lx={300} ly={100} />
          <Callout n={4} x={28} y={slopeY + 75} lx={300} ly={130} />
          <Callout n={5} x={90} y={slopeY + 100} lx={300} ly={160} />

          <Legend
            x={315}
            y={42}
            items={[
              "Standing seam membrane",
              "Roof deck sheathing",
              "Rigid insulation board",
              "Prefinished metal gutter",
              "Continuous soffit vent",
            ]}
          />
          <text x={40} y={30} fontSize="9" fill={STROKE} fontFamily="sans-serif" fontWeight="700">
            ROOFING DETAIL — EAVE / GUTTER ASSEMBLY
          </text>
        </svg>
      );
    }

    case "foundation": {
      // Concrete footing with wall, slab, waterproofing, drainage
      const gradeY = 130;
      const footingY = 260;
      return (
        <svg viewBox={vb} className={cls} xmlns={xmlns}>
          <Defs uid={uid} />
          {/* Soil */}
          <rect x="0" y={gradeY} width="400" height={400 - gradeY} fill={`url(#soil-${uid})`} />
          {/* Grade line */}
          <line x1="0" y1={gradeY} x2="400" y2={gradeY} stroke={STROKE} strokeWidth="2" />
          {/* Gravel backfill */}
          <rect x="180" y={gradeY} width="80" height={footingY - gradeY} fill={`url(#gravel-${uid})`} stroke={STROKE} strokeWidth="1" />
          {/* Foundation wall */}
          <rect x="140" y={gradeY - 20} width="40" height={footingY - gradeY + 20} fill={`url(#concrete-${uid})`} stroke={STROKE} strokeWidth="1.5" />
          {/* Footing */}
          <rect x="110" y={footingY} width="100" height="40" fill={`url(#concrete-${uid})`} stroke={STROKE} strokeWidth="1.5" />
          {/* Slab on grade */}
          <rect x="40" y={gradeY} width="100" height="15" fill={`url(#concrete-${uid})`} stroke={STROKE} strokeWidth="1.2" />
          {/* Vapor barrier under slab */}
          <line x1="40" y1={gradeY + 16} x2="140" y2={gradeY + 16} stroke={STROKE} strokeWidth="1.5" strokeDasharray="3,2" />
          {/* Rigid insulation under slab */}
          <rect x="40" y={gradeY + 17} width="100" height="10" fill={`url(#diag-${uid})`} stroke={STROKE} strokeWidth="0.8" />
          {/* Rebar in footing */}
          <circle cx="125" cy={footingY + 20} r="2.5" fill={STROKE} />
          <circle cx="150" cy={footingY + 20} r="2.5" fill={STROKE} />
          <circle cx="175" cy={footingY + 20} r="2.5" fill={STROKE} />
          <circle cx="200" cy={footingY + 20} r="2.5" fill={STROKE} />
          {/* Vertical rebar in wall */}
          <line x1="150" y1={footingY + 20} x2="150" y2={gradeY - 15} stroke={STROKE} strokeWidth="1" strokeDasharray="3,3" />
          <line x1="170" y1={footingY + 20} x2="170" y2={gradeY - 15} stroke={STROKE} strokeWidth="1" strokeDasharray="3,3" />
          {/* Waterproof membrane on wall */}
          <line x1="180" y1={gradeY - 15} x2="180" y2={footingY + 5} stroke={STROKE} strokeWidth="2" />
          <path
            d={`M 180 ${footingY + 5} Q 195 ${footingY + 8} 210 ${footingY}`}
            stroke={STROKE}
            strokeWidth="2"
            fill="none"
          />
          {/* Drain tile */}
          <circle cx="225" cy={footingY + 10} r="8" fill="none" stroke={STROKE} strokeWidth="1.2" />
          <circle cx="225" cy={footingY + 10} r="4" fill="none" stroke={STROKE} strokeWidth="0.8" />

          <Callout n={1} x={90} y={gradeY + 8} lx={60} ly={60} />
          <Callout n={2} x={160} y={footingY - 40} lx={60} ly={95} />
          <Callout n={3} x={160} y={footingY + 20} lx={60} ly={130} />
          <Callout n={4} x={180} y={gradeY + 30} lx={340} ly={60} />
          <Callout n={5} x={225} y={footingY + 10} lx={340} ly={100} />

          <Legend
            x={20}
            y={375}
            items={["4\" concrete slab", "Foundation wall", "Footing w/ rebar"]}
          />
          <Legend
            x={250}
            y={375}
            items={["Waterproof membrane", "4\" perforated drain"]}
          />
          <text x={20} y={30} fontSize="9" fill={STROKE} fontFamily="sans-serif" fontWeight="700">
            FOUNDATION — FOOTING & WALL DETAIL
          </text>
        </svg>
      );
    }

    case "insulation": {
      // Stud wall w/ continuous insulation, air barrier, interior/exterior finishes
      const studSpacing = randInt(r, 55, 75);
      const studCount = 3;
      return (
        <svg viewBox={vb} className={cls} xmlns={xmlns}>
          <Defs uid={uid} />
          {/* Interior gypsum */}
          <rect x="50" y="60" width="14" height="280" fill={`url(#diag-${uid})`} stroke={STROKE} strokeWidth="1" />
          {/* Stud cavity w/ batt insulation (wavy) */}
          <rect x="64" y="60" width="80" height="280" fill={`url(#insul-${uid})`} stroke={STROKE} strokeWidth="1" />
          {/* Studs */}
          {Array.from({ length: studCount }).map((_, i) => (
            <rect
              key={i}
              x={70 + i * studSpacing}
              y="60"
              width="8"
              height="280"
              fill={`url(#wood-${uid})`}
              stroke={STROKE}
              strokeWidth="1"
            />
          ))}
          {/* Top & bottom plates */}
          <rect x="64" y="60" width="80" height="8" fill={`url(#wood-${uid})`} stroke={STROKE} strokeWidth="1" />
          <rect x="64" y="332" width="80" height="8" fill={`url(#wood-${uid})`} stroke={STROKE} strokeWidth="1" />
          {/* Sheathing */}
          <rect x="144" y="60" width="10" height="280" fill={`url(#wood-${uid})`} stroke={STROKE} strokeWidth="1" />
          {/* Air barrier */}
          <line x1="154" y1="60" x2="154" y2="340" stroke={STROKE} strokeWidth="2" />
          {/* Continuous exterior insulation */}
          <rect x="154" y="60" width="36" height="280" fill={`url(#diag-${uid})`} stroke={STROKE} strokeWidth="1" />
          {/* Exterior cladding */}
          <rect x="190" y="60" width="14" height="280" fill="none" stroke={STROKE} strokeWidth="1.2" />
          {Array.from({ length: 6 }).map((_, i) => (
            <line
              key={i}
              x1="190"
              y1={60 + (i + 1) * 45}
              x2="204"
              y2={60 + (i + 1) * 45}
              stroke={STROKE}
              strokeWidth="0.8"
            />
          ))}
          {/* Fasteners */}
          {Array.from({ length: 5 }).map((_, i) => (
            <g key={i}>
              <line
                x1="154"
                y1={80 + i * 60}
                x2="204"
                y2={80 + i * 60}
                stroke={STROKE}
                strokeWidth="0.6"
              />
              <circle cx="204" cy={80 + i * 60} r="1.5" fill={STROKE} />
            </g>
          ))}

          <Callout n={1} x={57} y={200} lx={250} ly={80} />
          <Callout n={2} x={104} y={200} lx={250} ly={130} />
          <Callout n={3} x={149} y={200} lx={250} ly={180} />
          <Callout n={4} x={172} y={200} lx={250} ly={230} />
          <Callout n={5} x={197} y={200} lx={250} ly={280} />

          <Legend
            x={265}
            y={82}
            items={[
              "5/8\" gypsum board",
              "R-21 batt insulation",
              "OSB sheathing",
              "R-10 continuous insulation",
              "Fiber cement lap siding",
            ]}
          />
          <text x={40} y={40} fontSize="9" fill={STROKE} fontFamily="sans-serif" fontWeight="700">
            EXTERIOR WALL — INSULATION ASSEMBLY
          </text>
        </svg>
      );
    }

    case "joints": {
      // Expansion joint between two slabs / walls
      const jointX = 195;
      const jointW = 16;
      return (
        <svg viewBox={vb} className={cls} xmlns={xmlns}>
          <Defs uid={uid} />
          {/* Left concrete slab */}
          <rect x="30" y="120" width={jointX - 30} height="100" fill={`url(#concrete-${uid})`} stroke={STROKE} strokeWidth="1.5" />
          {/* Right concrete slab */}
          <rect x={jointX + jointW} y="120" width={370 - (jointX + jointW)} height="100" fill={`url(#concrete-${uid})`} stroke={STROKE} strokeWidth="1.5" />
          {/* Backer rod (circle) */}
          <circle cx={jointX + jointW / 2} cy="135" r="6" fill="none" stroke={STROKE} strokeWidth="1" />
          <line x1={jointX + jointW / 2 - 4} y1="131" x2={jointX + jointW / 2 + 4} y2="139" stroke={STROKE} strokeWidth="0.4" />
          <line x1={jointX + jointW / 2 - 4} y1="139" x2={jointX + jointW / 2 + 4} y2="131" stroke={STROKE} strokeWidth="0.4" />
          {/* Sealant cap */}
          <path
            d={`M ${jointX} 120 Q ${jointX + jointW / 2} 115 ${jointX + jointW} 120 L ${jointX + jointW} 128 L ${jointX} 128 Z`}
            fill={STROKE}
          />
          {/* Joint filler below backer rod */}
          <rect x={jointX + 2} y="145" width={jointW - 4} height="75" fill={`url(#diag-${uid})`} stroke={STROKE} strokeWidth="0.8" />
          {/* Rebar in slabs */}
          {Array.from({ length: 3 }).map((_, i) => (
            <g key={i}>
              <circle cx={60 + i * 40} cy="170" r="2.5" fill={STROKE} />
              <circle cx={250 + i * 40} cy="170" r="2.5" fill={STROKE} />
            </g>
          ))}
          {/* Dowel with sleeve across joint */}
          <rect x={jointX - 30} y="190" width="90" height="6" fill="none" stroke={STROKE} strokeWidth="1.2" />
          <rect x={jointX + 2} y="188" width="28" height="10" fill={`url(#diag-${uid})`} stroke={STROKE} strokeWidth="0.8" />
          {/* Metal cover plate above */}
          <rect x={jointX - 25} y="108" width="66" height="6" fill={STROKE} />
          <circle cx={jointX - 15} cy="111" r="1.5" fill="white" />
          <circle cx={jointX + 30} cy="111" r="1.5" fill="white" />
          {/* Topping slab above joint */}
          <rect x="30" y="100" width={jointX - 25 - 30} height="8" fill={`url(#concrete-${uid})`} stroke={STROKE} strokeWidth="1" />
          <rect x={jointX + 41} y="100" width={329 - jointX - 41} height="8" fill={`url(#concrete-${uid})`} stroke={STROKE} strokeWidth="1" />

          <Callout n={1} x={jointX + jointW / 2} y={108} lx={320} ly={60} />
          <Callout n={2} x={jointX + jointW / 2} y={124} lx={320} ly={90} />
          <Callout n={3} x={jointX + jointW / 2} y={135} lx={320} ly={120} />
          <Callout n={4} x={jointX + jointW / 2} y={180} lx={320} ly={150} />
          <Callout n={5} x={jointX + 15} y={193} lx={320} ly={180} />

          <Legend
            x={215}
            y={250}
            items={[
              "Aluminum cover plate",
              "Polyurethane sealant",
              "Closed-cell backer rod",
              "Compressible filler",
              "Dowel w/ slip sleeve",
            ]}
          />
          <text x={30} y={40} fontSize="9" fill={STROKE} fontFamily="sans-serif" fontWeight="700">
            EXPANSION JOINT — SLAB ASSEMBLY
          </text>
        </svg>
      );
    }

    case "waterproofing": {
      // Below-grade wall with membrane, protection board, drainage composite, drain tile
      const gradeY = 90;
      return (
        <svg viewBox={vb} className={cls} xmlns={xmlns}>
          <Defs uid={uid} />
          {/* Soil */}
          <rect x="230" y={gradeY} width="170" height="260" fill={`url(#soil-${uid})`} />
          {/* Gravel envelope */}
          <rect x="200" y={gradeY} width="30" height="260" fill={`url(#gravel-${uid})`} stroke={STROKE} strokeWidth="0.8" />
          {/* Grade line */}
          <line x1="120" y1={gradeY} x2="400" y2={gradeY} stroke={STROKE} strokeWidth="2" />
          {/* Concrete wall */}
          <rect x="120" y={gradeY - 20} width="50" height="280" fill={`url(#concrete-${uid})`} stroke={STROKE} strokeWidth="1.5" />
          {/* Footing */}
          <rect x="100" y="340" width="90" height="30" fill={`url(#concrete-${uid})`} stroke={STROKE} strokeWidth="1.5" />
          {/* Waterproof membrane - thick line */}
          <line x1="170" y1={gradeY - 20} x2="170" y2="345" stroke={STROKE} strokeWidth="3" />
          <path d="M 170 345 Q 175 352 185 350" stroke={STROKE} strokeWidth="3" fill="none" />
          {/* Protection board */}
          <rect x="173" y={gradeY - 5} width="6" height="345" fill={`url(#diag-${uid})`} stroke={STROKE} strokeWidth="0.8" />
          {/* Drainage composite (dimpled) */}
          <rect x="179" y={gradeY} width="10" height="260" fill="none" stroke={STROKE} strokeWidth="1" />
          {Array.from({ length: 16 }).map((_, i) => (
            <circle
              key={i}
              cx="184"
              cy={gradeY + 10 + i * 16}
              r="2"
              fill="none"
              stroke={STROKE}
              strokeWidth="0.7"
            />
          ))}
          {/* Drain tile */}
          <circle cx="215" cy="350" r="10" fill="none" stroke={STROKE} strokeWidth="1.5" />
          <circle cx="215" cy="350" r="5" fill="none" stroke={STROKE} strokeWidth="1" />
          {Array.from({ length: 6 }).map((_, i) => {
            const a = (i / 6) * Math.PI * 2;
            return (
              <circle
                key={i}
                cx={215 + Math.cos(a) * 7.5}
                cy={350 + Math.sin(a) * 7.5}
                r="0.8"
                fill={STROKE}
              />
            );
          })}
          {/* Slab on grade interior */}
          <rect x="30" y={gradeY} width="90" height="14" fill={`url(#concrete-${uid})`} stroke={STROKE} strokeWidth="1.2" />
          {/* Termination bar at top */}
          <rect x="166" y={gradeY - 25} width="8" height="10" fill={STROKE} />

          <Callout n={1} x={170} y={gradeY - 20} lx={310} ly={40} />
          <Callout n={2} x={170} y={150} lx={310} ly={70} />
          <Callout n={3} x={176} y={200} lx={310} ly={100} />
          <Callout n={4} x={184} y={250} lx={310} ly={130} />
          <Callout n={5} x={215} y={350} lx={310} ly={160} />

          <Legend
            x={325}
            y={42}
            items={[
              "Termination bar",
              "Bentonite membrane",
              "Protection board",
              "Drainage composite",
              "Perforated drain tile",
            ]}
          />
          <text x={20} y={40} fontSize="9" fill={STROKE} fontFamily="sans-serif" fontWeight="700">
            BELOW-GRADE WATERPROOFING
          </text>
        </svg>
      );
    }

    case "structural": {
      // Steel beam-to-column moment connection
      return (
        <svg viewBox={vb} className={cls} xmlns={xmlns}>
          <Defs uid={uid} />
          {/* Column web */}
          <rect x="180" y="60" width="40" height="300" fill={STROKE} />
          {/* Column flanges */}
          <rect x="160" y="60" width="80" height="14" fill={STROKE} />
          <rect x="160" y="346" width="80" height="14" fill={STROKE} />
          <rect x="160" y="60" width="14" height="300" fill={STROKE} />
          <rect x="226" y="60" width="14" height="300" fill={STROKE} />
          {/* Beam web */}
          <rect x="240" y="180" width="140" height="40" fill={STROKE} />
          {/* Beam flanges */}
          <rect x="240" y="166" width="140" height="14" fill={STROKE} />
          <rect x="240" y="220" width="140" height="14" fill={STROKE} />
          {/* Gusset / shear tab */}
          <rect x="240" y="176" width="50" height="52" fill="none" stroke="white" strokeWidth="1.2" />
          {/* Bolts on shear tab */}
          {[0, 1, 2].map((i) => (
            <g key={i}>
              <circle cx="260" cy={188 + i * 14} r="3" fill="white" stroke={STROKE} strokeWidth="0.6" />
              <circle cx="275" cy={188 + i * 14} r="3" fill="white" stroke={STROKE} strokeWidth="0.6" />
            </g>
          ))}
          {/* Continuity plates inside column */}
          <rect x="174" y="162" width="52" height="6" fill="white" stroke={STROKE} strokeWidth="0.8" />
          <rect x="174" y="232" width="52" height="6" fill="white" stroke={STROKE} strokeWidth="0.8" />
          {/* Weld symbols - triangles */}
          <polygon points="240,166 232,158 240,158" fill="white" stroke={STROKE} strokeWidth="0.8" />
          <polygon points="240,234 232,242 240,242" fill="white" stroke={STROKE} strokeWidth="0.8" />
          {/* Weld callout leader */}
          <line x1="236" y1="162" x2="300" y2="130" stroke={STROKE} strokeWidth="0.6" />
          <line x1="300" y1="130" x2="330" y2="130" stroke={STROKE} strokeWidth="0.6" />
          <polygon points="300,130 306,126 306,134" fill={STROKE} />
          <text x="312" y="128" fontSize="7" fill={STROKE} fontFamily="sans-serif">CJP</text>

          <Callout n={1} x={200} y={100} lx={80} ly={60} />
          <Callout n={2} x={310} y={200} lx={80} ly={100} />
          <Callout n={3} x={267} y={200} lx={80} ly={140} />
          <Callout n={4} x={200} y={165} lx={80} ly={180} />
          <Callout n={5} x={240} y={166} lx={80} ly={220} />

          <Legend
            x={30}
            y={260}
            items={[
              "W14 steel column",
              "W18 steel beam",
              "Shear tab w/ A325 bolts",
              "Continuity plates",
              "CJP groove weld",
            ]}
          />
          <text x={30} y={40} fontSize="9" fill={STROKE} fontFamily="sans-serif" fontWeight="700">
            STEEL MOMENT CONNECTION
          </text>
        </svg>
      );
    }

    case "mep": {
      // Pipe penetration through rated wall with fire stop
      return (
        <svg viewBox={vb} className={cls} xmlns={xmlns}>
          <Defs uid={uid} />
          {/* Wall gypsum layers */}
          <rect x="140" y="60" width="14" height="280" fill={`url(#diag-${uid})`} stroke={STROKE} strokeWidth="1" />
          <rect x="154" y="60" width="14" height="280" fill={`url(#diag-${uid})`} stroke={STROKE} strokeWidth="1" />
          {/* Stud cavity */}
          <rect x="168" y="60" width="60" height="280" fill={`url(#insul-${uid})`} stroke={STROKE} strokeWidth="1" />
          {/* Far side gypsum */}
          <rect x="228" y="60" width="14" height="280" fill={`url(#diag-${uid})`} stroke={STROKE} strokeWidth="1" />
          <rect x="242" y="60" width="14" height="280" fill={`url(#diag-${uid})`} stroke={STROKE} strokeWidth="1" />
          {/* Studs */}
          <rect x="172" y="60" width="8" height="280" fill="white" stroke={STROKE} strokeWidth="1" />
          <rect x="216" y="60" width="8" height="280" fill="white" stroke={STROKE} strokeWidth="1" />
          {/* Pipe crossing wall */}
          <rect x="30" y="180" width="340" height="36" fill="white" stroke={STROKE} strokeWidth="1.5" />
          <line x1="30" y1="186" x2="370" y2="186" stroke={STROKE} strokeWidth="0.8" />
          <line x1="30" y1="210" x2="370" y2="210" stroke={STROKE} strokeWidth="0.8" />
          {/* Sleeve */}
          <rect x="136" y="170" width="124" height="56" fill="none" stroke={STROKE} strokeWidth="1.5" />
          {/* Fire stop sealant (solid fill at edges) */}
          <rect x="136" y="170" width="10" height="56" fill={STROKE} />
          <rect x="250" y="170" width="10" height="56" fill={STROKE} />
          {/* Mineral wool packing */}
          <rect x="146" y="170" width="104" height="10" fill={`url(#insul-${uid})`} stroke={STROKE} strokeWidth="0.6" />
          <rect x="146" y="216" width="104" height="10" fill={`url(#insul-${uid})`} stroke={STROKE} strokeWidth="0.6" />
          {/* Escutcheon plates */}
          <rect x="126" y="168" width="10" height="60" fill={STROKE} />
          <rect x="260" y="168" width="10" height="60" fill={STROKE} />
          {/* Valve / coupling */}
          <rect x="60" y="174" width="20" height="48" fill="none" stroke={STROKE} strokeWidth="1.2" />
          <line x1="70" y1="160" x2="70" y2="174" stroke={STROKE} strokeWidth="1.2" />
          <rect x="62" y="150" width="16" height="12" fill="none" stroke={STROKE} strokeWidth="1" />
          {/* Hanger strap */}
          <path d="M 310 160 L 310 180 M 290 180 L 330 180" stroke={STROKE} strokeWidth="1.2" fill="none" />
          <line x1="300" y1="160" x2="320" y2="160" stroke={STROKE} strokeWidth="1.5" />

          <Callout n={1} x={200} y={198} lx={60} ly={80} />
          <Callout n={2} x={145} y={198} lx={60} ly={110} />
          <Callout n={3} x={200} y={175} lx={60} ly={140} />
          <Callout n={4} x={70} y={186} lx={60} ly={270} />
          <Callout n={5} x={310} y={170} lx={350} ly={80} />

          <Legend
            x={20}
            y={310}
            items={["Copper supply pipe", "Steel sleeve", "Intumescent fire stop"]}
          />
          <Legend x={240} y={310} items={["Shut-off valve", "Pipe hanger assembly"]} />
          <text x={30} y={40} fontSize="9" fill={STROKE} fontFamily="sans-serif" fontWeight="700">
            MEP — RATED WALL PIPE PENETRATION
          </text>
        </svg>
      );
    }

    default:
      return (
        <svg viewBox={vb} className={cls} xmlns={xmlns}>
          <Defs uid={uid} />
          <rect x="50" y="50" width="300" height="300" fill="none" stroke={STROKE} strokeWidth="1.5" />
        </svg>
      );
  }
}
