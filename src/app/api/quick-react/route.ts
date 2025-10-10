import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/firebase-admin";
import { Timestamp } from "firebase-admin/firestore";

const QuickReactSchema = z.object({
  intent: z.enum(["hire", "interview", "feedback"]),
  name: z.string().optional(),
  email: z.string().email().optional(),
  company: z.string().optional(),
  message: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const json = await req.json();

    console.log("[quick-react] raw request:", json);

    const data = QuickReactSchema.parse(json);
    console.log("[quick-react] validated:", data);

    await db.collection("quickReacts").add({
      ...data,
      createdAt: Timestamp.now(),
    });

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (err) {
    console.error("[quick-react] ERROR:", err);
    return NextResponse.json(
      { ok: false, error: (err as Error).message },
      { status: 400 }
    );
  }
}
