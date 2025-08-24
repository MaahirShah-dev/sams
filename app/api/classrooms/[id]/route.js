import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import Classroom from "@/models/Classroom";

export async function GET(req, { params }) {
  const { id } = await params;

  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  await dbConnect();

  const classroom = await Classroom.findById(id)
    .populate("studentIds", "name email")
    .lean();

  if (!classroom) {
    return new Response(JSON.stringify({ error: "Classroom not found" }), { status: 404 });
  }

  const teacher = await User.findById(classroom.teacherId)
    .select("name email")
    .lean();

  return new Response(
    JSON.stringify({
      _id: classroom._id,
      name: classroom.name,
      code: classroom.code,
      students: classroom.studentIds,
      teacher,
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

  const classroom = await Classroom.findById(id);
  if (!classroom) {
    return new Response(JSON.stringify({ error: "Classroom not found" }), { status: 404 });
  }

  const user = await User.findOne({ email: session.user.email });
  if (!user || String(classroom.teacherId) !== String(user._id)) {
    return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403 });
  }

  await User.updateMany(
    { classrooms: classroom._id },
    { $pull: { classrooms: classroom._id } }
  );

  await Classroom.findByIdAndDelete(classroom._id);

  return new Response(
    JSON.stringify({ message: "Classroom deleted successfully" }),
    { status: 200 }
  );
}
