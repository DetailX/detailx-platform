import { type Category } from "@/types";

// Architectural detail SVG previews by category — these get blurred behind the paywall
export function BlurredDetailPreview({ category }: { category: string }) {
  const svgContent = getDetailSvg(category as Category);

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

function getDetailSvg(category: Category) {
  const strokeColor = "#1a3dcc";
  const common = {
    stroke: strokeColor,
    strokeWidth: 1.5,
    fill: "none",
  };

  switch (category) {
    case "facade":
      return (
        <svg viewBox="0 0 300 200" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          {/* Wall sections with cladding layers */}
          <rect x="30" y="20" width="240" height="160" {...common} />
          <rect x="50" y="40" width="200" height="120" {...common} />
          {/* Cladding panels */}
          <line x1="50" y1="70" x2="250" y2="70" {...common} />
          <line x1="50" y1="100" x2="250" y2="100" {...common} />
          <line x1="50" y1="130" x2="250" y2="130" {...common} />
          {/* Insulation hatching */}
          <line x1="35" y1="25" x2="45" y2="35" {...common} strokeWidth={0.8} />
          <line x1="35" y1="40" x2="45" y2="50" {...common} strokeWidth={0.8} />
          <line x1="35" y1="55" x2="45" y2="65" {...common} strokeWidth={0.8} />
          <line x1="35" y1="70" x2="45" y2="80" {...common} strokeWidth={0.8} />
          {/* Dimension lines */}
          <line x1="30" y1="195" x2="270" y2="195" {...common} />
          <circle cx="100" cy="80" r="20" {...common} />
          <text x="95" y="85" fill={strokeColor} fontSize="10">A</text>
        </svg>
      );
    case "roofing":
      return (
        <svg viewBox="0 0 300 200" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          {/* Roof slope */}
          <polygon points="30,150 150,40 270,150" {...common} />
          <line x1="30" y1="150" x2="270" y2="150" {...common} />
          {/* Roof layers */}
          <polygon points="40,145 150,50 260,145" {...common} />
          <polygon points="50,140 150,60 250,140" {...common} />
          {/* Shingles */}
          <line x1="80" y1="120" x2="220" y2="120" {...common} strokeDasharray="4,4" />
          <line x1="100" y1="100" x2="200" y2="100" {...common} strokeDasharray="4,4" />
          {/* Gutter */}
          <rect x="20" y="150" width="15" height="10" {...common} />
          <rect x="265" y="150" width="15" height="10" {...common} />
          <circle cx="150" cy="60" r="15" {...common} />
        </svg>
      );
    case "foundation":
      return (
        <svg viewBox="0 0 300 200" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          {/* Ground level */}
          <line x1="10" y1="80" x2="290" y2="80" {...common} strokeWidth={2} />
          {/* Foundation footer */}
          <rect x="80" y="80" width="140" height="30" {...common} />
          <rect x="120" y="110" width="60" height="80" {...common} />
          {/* Rebar */}
          <line x1="85" y1="95" x2="215" y2="95" {...common} strokeDasharray="2,3" />
          <line x1="125" y1="115" x2="125" y2="185" {...common} strokeDasharray="2,3" />
          <line x1="175" y1="115" x2="175" y2="185" {...common} strokeDasharray="2,3" />
          {/* Soil hatching */}
          <line x1="10" y1="80" x2="15" y2="85" {...common} strokeWidth={0.5} />
          <line x1="25" y1="80" x2="30" y2="85" {...common} strokeWidth={0.5} />
          <line x1="40" y1="80" x2="45" y2="85" {...common} strokeWidth={0.5} />
          <line x1="55" y1="80" x2="60" y2="85" {...common} strokeWidth={0.5} />
          <line x1="240" y1="80" x2="245" y2="85" {...common} strokeWidth={0.5} />
          <line x1="255" y1="80" x2="260" y2="85" {...common} strokeWidth={0.5} />
          <line x1="270" y1="80" x2="275" y2="85" {...common} strokeWidth={0.5} />
        </svg>
      );
    case "insulation":
      return (
        <svg viewBox="0 0 300 200" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          {/* Wall assembly */}
          <rect x="40" y="30" width="220" height="140" {...common} />
          <line x1="80" y1="30" x2="80" y2="170" {...common} />
          <line x1="140" y1="30" x2="140" y2="170" {...common} />
          <line x1="200" y1="30" x2="200" y2="170" {...common} />
          {/* Insulation waves */}
          <path d="M 85 40 Q 95 50 105 40 T 125 40 T 135 40" {...common} />
          <path d="M 85 60 Q 95 70 105 60 T 125 60 T 135 60" {...common} />
          <path d="M 85 80 Q 95 90 105 80 T 125 80 T 135 80" {...common} />
          <path d="M 85 100 Q 95 110 105 100 T 125 100 T 135 100" {...common} />
          <path d="M 85 120 Q 95 130 105 120 T 125 120 T 135 120" {...common} />
          <path d="M 85 140 Q 95 150 105 140 T 125 140 T 135 140" {...common} />
          {/* Studs */}
          <rect x="145" y="35" width="50" height="130" {...common} />
          <circle cx="220" cy="100" r="15" {...common} />
        </svg>
      );
    case "joints":
      return (
        <svg viewBox="0 0 300 200" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          {/* Two wall sections with expansion joint */}
          <rect x="20" y="40" width="130" height="120" {...common} />
          <rect x="150" y="40" width="130" height="120" {...common} />
          {/* Joint detail */}
          <rect x="145" y="30" width="10" height="140" {...common} />
          <line x1="145" y1="60" x2="155" y2="60" {...common} />
          <line x1="145" y1="100" x2="155" y2="100" {...common} />
          <line x1="145" y1="140" x2="155" y2="140" {...common} />
          {/* Sealant bead */}
          <ellipse cx="150" cy="80" rx="6" ry="4" {...common} />
          <ellipse cx="150" cy="120" rx="6" ry="4" {...common} />
          <circle cx="150" cy="100" r="25" {...common} />
        </svg>
      );
    case "waterproofing":
      return (
        <svg viewBox="0 0 300 200" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          {/* Wall and footer below grade */}
          <line x1="10" y1="60" x2="290" y2="60" {...common} strokeWidth={2} />
          <rect x="100" y="60" width="40" height="130" {...common} />
          <rect x="80" y="160" width="80" height="30" {...common} />
          {/* Waterproof membrane - wavy line */}
          <path d="M 100 60 Q 95 80 100 100 T 100 140 T 100 180" {...common} strokeWidth={2} />
          <path d="M 100 180 Q 90 185 80 180" {...common} strokeWidth={2} />
          {/* Drainage board dots */}
          <circle cx="90" cy="80" r="1" fill={strokeColor} />
          <circle cx="88" cy="100" r="1" fill={strokeColor} />
          <circle cx="90" cy="120" r="1" fill={strokeColor} />
          <circle cx="88" cy="140" r="1" fill={strokeColor} />
          <circle cx="90" cy="160" r="1" fill={strokeColor} />
          {/* Drain pipe */}
          <circle cx="175" cy="175" r="8" {...common} />
          <circle cx="175" cy="175" r="4" {...common} />
        </svg>
      );
    case "structural":
      return (
        <svg viewBox="0 0 300 200" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          {/* I-beam connection */}
          <rect x="40" y="90" width="120" height="20" {...common} />
          <rect x="90" y="40" width="20" height="120" {...common} />
          {/* Gusset plate */}
          <polygon points="60,110 60,130 140,130 140,90 120,90 120,110" {...common} />
          {/* Bolts */}
          <circle cx="75" cy="120" r="3" {...common} />
          <circle cx="95" cy="120" r="3" {...common} />
          <circle cx="115" cy="120" r="3" {...common} />
          <circle cx="135" cy="120" r="3" {...common} />
          <circle cx="75" cy="100" r="3" {...common} />
          <circle cx="135" cy="100" r="3" {...common} />
          {/* Weld symbols */}
          <path d="M 160 100 L 175 100 L 170 95" {...common} />
          <circle cx="200" cy="100" r="20" {...common} />
        </svg>
      );
    case "mep":
      return (
        <svg viewBox="0 0 300 200" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          {/* Pipes and ducts */}
          <rect x="30" y="30" width="240" height="140" {...common} strokeDasharray="6,4" />
          {/* Main duct */}
          <rect x="50" y="60" width="200" height="30" {...common} />
          {/* Pipe */}
          <line x1="60" y1="120" x2="240" y2="120" {...common} strokeWidth={3} />
          <circle cx="60" cy="120" r="4" {...common} />
          <circle cx="240" cy="120" r="4" {...common} />
          {/* Vertical pipe */}
          <line x1="150" y1="75" x2="150" y2="160" {...common} strokeWidth={2} />
          <rect x="142" y="150" width="16" height="12" {...common} />
          {/* Conduit */}
          <line x1="70" y1="140" x2="230" y2="140" {...common} strokeDasharray="3,3" />
          <circle cx="180" cy="100" r="18" {...common} />
        </svg>
      );
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
