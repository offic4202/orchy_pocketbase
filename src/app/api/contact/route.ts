import { NextResponse } from "next/server";
import { pb } from "@/lib/pocketbase";
import { ContactMessageRecord } from "@/types";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Name, email, and message are required" }, { status: 400 });
    }

    const record = await pb.collection("contact_messages").create({
      name,
      email,
      phone: phone || "",
      message,
    });

    return NextResponse.json({ success: true, data: record });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}
