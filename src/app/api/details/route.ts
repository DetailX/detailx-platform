import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { details, users } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { generateId } from "@/lib/utils";
import { submitDetailSchema } from "@/types";

export async function GET(request: NextRequest) {
  const category = request.nextUrl.searchParams.get("category");

  const allDetails = await db
    .select({
      id: details.id,
      title: details.title,
      description: details.description,
      category: details.category,
      buildingType: details.buildingType,
      previewImageKey: details.previewImageKey,
      price: details.price,
      firmName: users.firmName,
    })
    .from(details)
    .innerJoin(users, eq(details.firmId, users.id))
    .orderBy(desc(details.createdAt));

  const filtered = category
    ? allDetails.filter((d) => d.category === category)
    : allDetails;

  return NextResponse.json(filtered);
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "firm") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = submitDetailSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.errors[0].message },
      { status: 400 }
    );
  }

  const detail = parsed.data;

  await db.insert(details).values({
    id: generateId(),
    title: detail.title,
    description: detail.description,
    category: detail.category,
    buildingType: detail.buildingType,
    firmId: session.user.id,
    previewImageKey: detail.previewImageKey,
    detailFileKeys: detail.detailFileKeys,
    price: detail.price,
  });

  return NextResponse.json({ message: "Detail created" }, { status: 201 });
}
