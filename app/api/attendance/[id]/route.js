import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Attendance from "@/models/Attendance";

export async function PUT(req, { params }) {
  await dbConnect();
  try {
    const { id } = params;
    const body = await req.json();

    const updated = await Attendance.findByIdAndUpdate(id, body, {
      new: true,
    });
    if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json(updated);
  } catch (err) {
    console.error("Error PUT attendance:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  await dbConnect();
  try {
    const { id } = params;
    const deleted = await Attendance.findByIdAndDelete(id);
    if (!deleted) return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error DELETE attendance:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
