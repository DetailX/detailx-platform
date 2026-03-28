import { Button } from "@/components/ui/button";
import { Download, FileText, FileCode } from "lucide-react";

interface UnlockedContentProps {
  detailFileKeys: string[];
  detailId: string;
}

function getFileIcon(key: string) {
  if (key.endsWith(".dwg") || key.endsWith(".dxf")) return FileCode;
  return FileText;
}

function getFileName(key: string) {
  return key.split("/").pop() || key;
}

export function UnlockedContent({ detailFileKeys, detailId }: UnlockedContentProps) {
  return (
    <div className="rounded-xl border border-green-200 bg-green-50 p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
          <Download className="h-5 w-5 text-green-700" />
        </div>
        <div>
          <h3 className="font-semibold text-green-900">Detail Unlocked</h3>
          <p className="text-sm text-green-700">
            You have access to all files for this detail.
          </p>
        </div>
      </div>

      <div className="space-y-2">
        {detailFileKeys.map((key) => {
          const Icon = getFileIcon(key);
          return (
            <a
              key={key}
              href={`/api/s3/download-url?key=${encodeURIComponent(key)}&detailId=${detailId}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                variant="outline"
                className="w-full justify-start gap-3 bg-white hover:bg-green-50 border-green-200"
              >
                <Icon size={18} className="text-green-700" />
                <span className="text-sm">{getFileName(key)}</span>
                <Download size={14} className="ml-auto text-green-600" />
              </Button>
            </a>
          );
        })}
      </div>
    </div>
  );
}
