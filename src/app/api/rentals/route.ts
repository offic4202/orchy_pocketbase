import { NextResponse } from "next/server";
import { pb } from "@/lib/pocketbase";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { customerName, customerEmail, customerPhone, product, pickupDate, returnDate, notes } = body;

    if (!customerName || !customerEmail || !product || !pickupDate || !returnDate) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const record = await pb.collection("rental_bookings").create({
      customerName,
      customerEmail,
      customerPhone: customerPhone || "",
      product,
      pickupDate,
      returnDate,
      status: 'Pending',
      notes: notes || "",
    });

    return NextResponse.json({ success: true, data: record });
  } catch (error) {
    console.error("Rental booking error:", error);
    return NextResponse.json({ error: "Failed to submit booking" }, { status: 500 });
  }
}
