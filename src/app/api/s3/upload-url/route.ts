import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getUploadUrl } from "@/lib/s3";
import { generateId } from "@/lib/utils";

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "firm") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const filename = request.nextUrl.searchParams.get("filename");
  const contentType = request.nextUrl.searchParams.get("contentType");
  const access = request.nextUrl.searchParams.get("access") || "private";

  if (!filename || !contentType) {
    return NextResponse.json(
      { error: "filename and contentType are required" },
      { status: 400 }
    );
  }

  const prefix = access === "public" ? "previews" : "details";
  const key = `${prefix}/${session.user.id}/${generateId()}-${filename}`;

  const url = await getUploadUrl(key, contentType);
  return NextResponse.json({ url, key });
}
