import { type Category } from "@/types";

// Architectural detail SVG previews by category — each card gets a unique
// procedurally-varied drawing seeded by the detail id.
export function BlurredDetailPreview({
  category,
  seed = "default",
}: {
  category: string;
  seed?: string;
}) {
  const rng = makeRng(seed);
  const svgContent = getDetailSvg(category as Category, rng);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Light blueprint background */}
      <div className="absolute inset-0 bg-[#f5f7ff]" />
      <div
        className="absolute inset-0 opacity-[0.5]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(59,91,255,0.15) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59,91,255,0.15) 1px, transparent 1px)
          `,
          backgroundSize: "20px 20px",
        }}
      />

      {/* The detail drawing - blurred */}
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{ filter: "blur(6px)" }}
      >
        {svgContent}
      </div>

      {/* Extra overlay to enhance blurred look */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-white/40" />
    </div>
  );
}

// Deterministic seeded RNG so the same detail always renders the same drawing
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

function getDetailSvg(category: Category, r: Rng) {
  const strokeColor = "#1a3dcc";
  const common = {
    stroke: strokeColor,
    strokeWidth: 1.5,
    fill: "none" as const,
  };

  switch (category) {
    case "facade": {
      const panelRows = randInt(r, 3, 5);
      const hasCircle = r() > 0.4;
      const cx = randInt(r, 70, 230);
      const cy = randInt(r, 60, 140);
      const cr = randInt(r, 12, 22);
      const innerX = randInt(r, 45, 60);
      const innerW = 300 - innerX * 2;
      const rows = Array.from({ length: panelRows }, (_, i) => 40 + ((i + 1) * 120) / (panelRows + 1));
      return (
        <svg viewBox="0 0 300 200" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <rect x="30" y="20" width="240" height="160" {...common} />
          <rect x={innerX} y="40" width={innerW} height="120" {...common} />
          {rows.map((y, i) => (
            <line key={i} x1={innerX} y1={y} x2={innerX + innerW} y2={y} {...common} />
          ))}
          {Array.from({ length: randInt(r, 3, 6) }).map((_, i) => (
            <line
              key={i}
              x1={35}
              y1={25 + i * 15}
              x2={45}
              y2={35 + i * 15}
              {...common}
              strokeWidth={0.8}
            />
          ))}
          <line x1="30" y1="195" x2="270" y2="195" {...common} />
          {hasCircle && <circle cx={cx} cy={cy} r={cr} {...common} />}
          <text x={cx - 5} y={cy + 5} fill={strokeColor} fontSize="10">
            {String.fromCharCode(65 + randInt(r, 0, 5))}
          </text>
        </svg>
      );
    }
    case "roofing": {
      const peakX = randInt(r, 120, 180);
      const peakY = randInt(r, 30, 60);
      const baseY = 150;
      const layers = randInt(r, 2, 4);
      return (
        <svg viewBox="0 0 300 200" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <polygon points={`30,${baseY} ${peakX},${peakY} 270,${baseY}`} {...common} />
          <line x1="30" y1={baseY} x2="270" y2={baseY} {...common} />
          {Array.from({ length: layers }).map((_, i) => {
            const inset = (i + 1) * 10;
            return (
              <polygon
                key={i}
                points={`${30 + inset},${baseY - inset / 2} ${peakX},${peakY + inset} ${270 - inset},${baseY - inset / 2}`}
                {...common}
              />
            );
          })}
          {Array.from({ length: randInt(r, 2, 4) }).map((_, i) => (
            <line
              key={i}
              x1={80 + i * 5}
              y1={120 - i * 20}
              x2={220 - i * 5}
              y2={120 - i * 20}
              {...common}
              strokeDasharray="4,4"
            />
          ))}
          <rect x="20" y={baseY} width="15" height="10" {...common} />
          <rect x="265" y={baseY} width="15" height="10" {...common} />
          <circle cx={peakX} cy={peakY + 20} r={randInt(r, 10, 18)} {...common} />
        </svg>
      );
    }
    case "foundation": {
      const groundY = randInt(r, 70, 95);
      const footerW = randInt(r, 120, 160);
      const footerX = (300 - footerW) / 2;
      const wallW = randInt(r, 50, 70);
      const wallX = (300 - wallW) / 2;
      return (
        <svg viewBox="0 0 300 200" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <line x1="10" y1={groundY} x2="290" y2={groundY} {...common} strokeWidth={2} />
          <rect x={footerX} y={groundY} width={footerW} height={randInt(r, 25, 40)} {...common} />
          <rect x={wallX} y={groundY + 30} width={wallW} height={randInt(r, 70, 95)} {...common} />
          <line
            x1={footerX + 5}
            y1={groundY + 15}
            x2={footerX + footerW - 5}
            y2={groundY + 15}
            {...common}
            strokeDasharray="2,3"
          />
          {Array.from({ length: randInt(r, 2, 4) }).map((_, i) => {
            const x = wallX + 5 + i * ((wallW - 10) / Math.max(1, randInt(r, 2, 4) - 1));
            return <line key={i} x1={x} y1={groundY + 35} x2={x} y2={groundY + 100} {...common} strokeDasharray="2,3" />;
          })}
          {Array.from({ length: randInt(r, 5, 10) }).map((_, i) => (
            <line
              key={i}
              x1={10 + i * 28}
              y1={groundY}
              x2={15 + i * 28}
              y2={groundY + 5}
              {...common}
              strokeWidth={0.5}
            />
          ))}
        </svg>
      );
    }
    case "insulation": {
      const studCount = randInt(r, 3, 5);
      const waves = randInt(r, 4, 7);
      const studW = 220 / studCount;
      return (
        <svg viewBox="0 0 300 200" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <rect x="40" y="30" width="220" height="140" {...common} />
          {Array.from({ length: studCount }).map((_, i) => (
            <line key={i} x1={40 + (i + 1) * studW} y1="30" x2={40 + (i + 1) * studW} y2="170" {...common} />
          ))}
          {Array.from({ length: waves }).map((_, i) => (
            <path
              key={i}
              d={`M 85 ${40 + i * 18} Q 95 ${50 + i * 18} 105 ${40 + i * 18} T 125 ${40 + i * 18} T 135 ${40 + i * 18}`}
              {...common}
            />
          ))}
          <rect
            x={145}
            y={35}
            width={randInt(r, 35, 60)}
            height={randInt(r, 110, 135)}
            {...common}
          />
          <circle cx={randInt(r, 200, 240)} cy={randInt(r, 80, 120)} r={randInt(r, 10, 18)} {...common} />
        </svg>
      );
    }
    case "joints": {
      const jointX = randInt(r, 130, 170);
      const jointW = randInt(r, 8, 16);
      const beads = randInt(r, 2, 4);
      return (
        <svg viewBox="0 0 300 200" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <rect x="20" y="40" width={jointX - 25} height="120" {...common} />
          <rect x={jointX + jointW - 5} y="40" width={305 - jointX - jointW} height="120" {...common} />
          <rect x={jointX - 5} y="30" width={jointW} height="140" {...common} />
          {Array.from({ length: randInt(r, 2, 4) }).map((_, i) => (
            <line
              key={i}
              x1={jointX - 5}
              y1={60 + i * 30}
              x2={jointX + jointW - 5}
              y2={60 + i * 30}
              {...common}
            />
          ))}
          {Array.from({ length: beads }).map((_, i) => (
            <ellipse
              key={i}
              cx={jointX + jointW / 2 - 5}
              cy={70 + i * 30}
              rx={randInt(r, 4, 8)}
              ry={randInt(r, 3, 5)}
              {...common}
            />
          ))}
          <circle cx={jointX + jointW / 2 - 5} cy="100" r={randInt(r, 18, 28)} {...common} />
        </svg>
      );
    }
    case "waterproofing": {
      const gradeY = randInt(r, 50, 75);
      const wallX = randInt(r, 90, 120);
      const wallW = randInt(r, 30, 50);
      return (
        <svg viewBox="0 0 300 200" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <line x1="10" y1={gradeY} x2="290" y2={gradeY} {...common} strokeWidth={2} />
          <rect x={wallX} y={gradeY} width={wallW} height={130} {...common} />
          <rect x={wallX - 20} y={160} width={wallW + 40} height={30} {...common} />
          <path
            d={`M ${wallX} ${gradeY} Q ${wallX - 5} ${gradeY + 20} ${wallX} ${gradeY + 40} T ${wallX} ${gradeY + 80} T ${wallX} ${gradeY + 120}`}
            {...common}
            strokeWidth={2}
          />
          {Array.from({ length: randInt(r, 4, 7) }).map((_, i) => (
            <circle
              key={i}
              cx={wallX - 10}
              cy={gradeY + 20 + i * 20}
              r={1}
              fill={strokeColor}
            />
          ))}
          <circle cx={randInt(r, 160, 220)} cy={175} r={randInt(r, 6, 10)} {...common} />
          <circle cx={randInt(r, 160, 220)} cy={175} r={randInt(r, 2, 5)} {...common} />
        </svg>
      );
    }
    case "structural": {
      const beamY = randInt(r, 80, 110);
      const colX = randInt(r, 80, 120);
      const bolts = randInt(r, 3, 6);
      return (
        <svg viewBox="0 0 300 200" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <rect x="40" y={beamY} width="120" height="20" {...common} />
          <rect x={colX} y="40" width="20" height="120" {...common} />
          <polygon
            points={`${colX - 30},${beamY + 20} ${colX - 30},${beamY + 40} ${colX + 50},${beamY + 40} ${colX + 50},${beamY} ${colX + 30},${beamY} ${colX + 30},${beamY + 20}`}
            {...common}
          />
          {Array.from({ length: bolts }).map((_, i) => (
            <circle
              key={i}
              cx={colX - 25 + i * 15}
              cy={beamY + 30}
              r={3}
              {...common}
            />
          ))}
          {Array.from({ length: randInt(r, 2, 4) }).map((_, i) => (
            <circle key={`t-${i}`} cx={colX - 25 + i * 25} cy={beamY + 10} r={3} {...common} />
          ))}
          <path
            d={`M 160 ${beamY + 10} L 175 ${beamY + 10} L 170 ${beamY + 5}`}
            {...common}
          />
          <circle cx={randInt(r, 190, 230)} cy={beamY + 10} r={randInt(r, 15, 25)} {...common} />
        </svg>
      );
    }
    case "mep": {
      const ductY = randInt(r, 40, 70);
      const pipeY = randInt(r, 100, 135);
      const ductH = randInt(r, 20, 40);
      return (
        <svg viewBox="0 0 300 200" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <rect x="30" y="30" width="240" height="140" {...common} strokeDasharray="6,4" />
          <rect x="50" y={ductY} width="200" height={ductH} {...common} />
          <line x1="60" y1={pipeY} x2="240" y2={pipeY} {...common} strokeWidth={3} />
          <circle cx="60" cy={pipeY} r="4" {...common} />
          <circle cx="240" cy={pipeY} r="4" {...common} />
          <line x1={randInt(r, 120, 180)} y1={ductY + ductH} x2={randInt(r, 120, 180)} y2={160} {...common} strokeWidth={2} />
          {Array.from({ length: randInt(r, 1, 3) }).map((_, i) => (
            <line
              key={i}
              x1="70"
              y1={150 + i * 8}
              x2="230"
              y2={150 + i * 8}
              {...common}
              strokeDasharray="3,3"
            />
          ))}
          <circle cx={randInt(r, 140, 220)} cy={randInt(r, 80, 120)} r={randInt(r, 12, 22)} {...common} />
        </svg>
      );
    }
    default:
      return (
        <svg viewBox="0 0 300 200" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <rect x="30" y="30" width="240" height="140" {...common} />
          <line x1="30" y1="100" x2="270" y2="100" {...common} />
          <line x1="150" y1="30" x2="150" y2="170" {...common} />
          <circle cx="150" cy="100" r="30" {...common} />
        </svg>
      );
  }
}
