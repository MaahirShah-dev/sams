import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Attendance from "@/models/Attendance";

export async function POST(req) {
  await dbConnect();
  try {
    const body = await req.json();
    const { subjectId, classroomId, date, lectures, records } = body;

    if (!subjectId || !classroomId || !date || !records?.length) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const existing = await Attendance.findOne({ subjectId, date });
    if (existing) {
      return NextResponse.json(
        { error: "Attendance already exists for this date" },
        { status: 400 }
      );
    }

    const attendance = await Attendance.create({
      subjectId,
      classroomId,
      date,
      lectures,
      records,
    });

    return NextResponse.json(attendance, { status: 201 });
  } catch (err) {
    console.error("Error POST attendance:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// ✅ READ attendance list
export async function GET(req) {
  await dbConnect();
  try {
    const { searchParams } = new URL(req.url);
    const subjectId = searchParams.get("subjectId");

    if (!subjectId)
      return NextResponse.json({ error: "subjectId required" }, { status: 400 });

    const records = await Attendance.find({ subjectId }).sort({ date: -1 });
    return NextResponse.json(records);
  } catch (err) {
    console.error("Error GET attendance:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
