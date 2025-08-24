import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import Classroom from "@/models/Classroom";
import Subject from "@/models/Subject";

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  await dbConnect();

  const { name, classroomCode } = await req.json();
  if (!name?.trim() || !classroomCode) {
    return new Response(
      JSON.stringify({ error: "Subject name and classroom code required" }),
      { status: 400 }
    );
  }

  const teacher = await User.findOne({ email: session.user.email });
  if (!teacher || teacher.role !== "teacher") {
    return new Response(
      JSON.stringify({ error: "Only teachers can add subjects" }),
      { status: 403 }
    );
  }

  const classroom = await Classroom.findOne({ code: classroomCode });
  if (!classroom) {
    return new Response(JSON.stringify({ error: "Classroom not found" }), { status: 404 });
  }

  let subject = await Subject.create({
    name: name.trim(),
    classroomId: classroom._id,
    teacherId: teacher._id,
  });

  subject = await Subject.findById(subject._id)
    .populate("teacherId", "name email")
    .lean();

  return new Response(JSON.stringify(subject), { status: 201 });
}

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const classroomCode = searchParams.get("classroomCode");

  if (!classroomCode) {
    return new Response(
      JSON.stringify({ error: "Classroom code required" }),
      { status: 400 }
    );
  }

  await dbConnect();

  const classroom = await Classroom.findOne({ code: classroomCode });
  if (!classroom) {
    return new Response(JSON.stringify({ error: "Classroom not found" }), { status: 404 });
  }

  const subjects = await Subject.find({ classroomId: classroom._id })
    .populate("teacherId", "name email")
    .lean();

  return new Response(JSON.stringify(subjects), { status: 200 });
}
