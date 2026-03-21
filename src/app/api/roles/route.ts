import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { roles } from "@/lib/schema/index";
import { asc } from "drizzle-orm";

export async function GET() {
  try {
    const data = await db.select().from(roles).orderBy(asc(roles.id));
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: "No se pudieron cargar los roles" }, { status: 500 });
  }
}