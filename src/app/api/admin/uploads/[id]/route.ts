import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { uploads, users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;

  const [row] = await db
    .select({
      id: uploads.id,
      userId: uploads.userId,
      userName: users.name,
      userEmail: users.email,
      projectName: uploads.projectName,
      fileName: uploads.fileName,
      fileType: uploads.fileType,
      status: uploads.status,
      location: uploads.location,
      notes: uploads.notes,
      createdAt: uploads.createdAt,
    })
    .from(uploads)
    .leftJoin(users, eq(uploads.userId, users.id))
    .where(eq(uploads.id, id))
    .limit(1);

  if (!row) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(row);
}
