import { Button } from "@/components/ui/button";
import { Download, FileText, FileCode, FileBox } from "lucide-react";

interface UnlockedContentProps {
  detailFileKeys: string[];
  detailId: string;
}

// Derive a base filename from the first stored file key, falling back to the id.
function getBaseName(keys: string[], detailId: string) {
  if (keys.length > 0) {
    const first = keys[0].split("/").pop() || keys[0];
    return first.replace(/\.[^.]+$/, "");
  }
  return detailId;
}

const formats = [
  {
    ext: "pdf",
    label: "PDF Document",
    description: "Printable specification sheet with annotations",
    Icon: FileText,
  },
  {
    ext: "dwg",
    label: "AutoCAD Drawing",
    description: "Native AutoCAD format for editing",
    Icon: FileCode,
  },
  {
    ext: "dxf",
    label: "DXF Exchange",
    description: "Universal CAD interchange format",
    Icon: FileBox,
  },
] as const;

export function UnlockedContent({ detailFileKeys, detailId }: UnlockedContentProps) {
  const base = getBaseName(detailFileKeys, detailId);

  return (
    <div className="rounded-xl border border-green-200 bg-green-50 p-6">
      <div className="flex items-center gap-3 mb-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
          <Download className="h-5 w-5 text-green-700" />
        </div>
        <div>
          <h3 className="font-semibold text-green-900">Detail Unlocked</h3>
          <p className="text-sm text-green-700">
            Download the full technical detail in any format below.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {formats.map(({ ext, label, description, Icon }) => {
          const fileName = `${base}.${ext}`;
          const key = `details/${detailId}/${fileName}`;
          return (
            <a
              key={ext}
              href={`/api/s3/download-url?key=${encodeURIComponent(key)}&detailId=${detailId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group block rounded-lg bg-white border border-green-200 p-4 hover:border-green-400 hover:shadow-md transition-all"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 group-hover:bg-green-200 transition-colors">
                  <Icon size={20} className="text-green-700" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-green-700 bg-green-100 px-2 py-1 rounded">
                  .{ext}
                </span>
              </div>
              <p className="text-sm font-semibold text-green-900">{label}</p>
              <p className="text-xs text-green-700/80 mt-0.5 mb-3">{description}</p>
              <div className="flex items-center gap-1.5 text-xs font-medium text-green-700 group-hover:text-green-800">
                <Download size={12} />
                Download {fileName}
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
}
