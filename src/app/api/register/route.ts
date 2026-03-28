import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { hashSync } from "bcryptjs";
import { generateId } from "@/lib/utils";
import { registerSchema } from "@/types";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = registerSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.errors[0].message },
      { status: 400 }
    );
  }

  const { name, email, password, role, firmName } = parsed.data;

  // Check if email already exists
  const [existing] = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (existing) {
    return NextResponse.json(
      { error: "An account with this email already exists" },
      { status: 409 }
    );
  }

  const passwordHash = hashSync(password, 10);

  await db.insert(users).values({
    id: generateId(),
    name,
    email,
    passwordHash,
    role,
    firmName: role === "firm" ? firmName || null : null,
  });

  return NextResponse.json({ message: "Account created" }, { status: 201 });
}
