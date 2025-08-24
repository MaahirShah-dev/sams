import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import Subject from "@/models/Subject";
import Classroom from "@/models/Classroom";
import User from "@/models/User";

export async function GET(req, { params }) {
  const { id } = await params;

  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  await dbConnect();

  const subject = await Subject.findById(id).lean();
  if (!subject) {
    return new Response(JSON.stringify({ error: "Subject not found" }), { status: 404 });
  }

  const user = await User.findOne({ email: session.user.email }).lean();

  const teacher = await User.findById(subject.teacherId)
    .select("name email role")
    .lean();

  const classroom = await Classroom.findById(subject.classroomId).lean();
  const students =
    classroom?.studentIds?.length > 0
      ? await User.find({ _id: { $in: classroom.studentIds }, role: "student" })
        .select("name email role")
        .lean()
      : [];

  return new Response(
    JSON.stringify({
      _id: subject._id,
      name: subject.name,
      classroomId: subject.classroomId,
      teacher,
      students,
      currentStudentId: user?.role === "student" ? user._id : null,
    }),
    { status: 200 }
  );
}

export async function DELETE(req, { params }) {
  const { id } = await params;

  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  await dbConnect();

  const subject = await Subject.findById(id);
  if (!subject) {
    return new Response(JSON.stringify({ error: "Subject not found" }), { status: 404 });
  }

  const user = await User.findOne({ email: session.user.email });
  if (!user || String(subject.teacherId) !== String(user._id)) {
    return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403 });
  }

  const classroomId = subject.classroomId;

  await Subject.findByIdAndDelete(id);

  return new Response(
    JSON.stringify({
      message: "Subject deleted successfully",
      classroomId,
    }),
    { status: 200 }
  );
}
