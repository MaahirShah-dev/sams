import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import Classroom from "@/models/Classroom";
import User from "@/models/User";

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  const { classroomCode } = await req.json();
  if (!classroomCode) {
    return new Response(JSON.stringify({ error: "Classroom code is required" }), { status: 400 });
  }

  await dbConnect();

  const classroom = await Classroom.findOne({ code: classroomCode });
  if (!classroom) {
    return new Response(JSON.stringify({ error: "Classroom not found" }), { status: 404 });
  }

  const user = await User.findOne({ email: session.user.email });
  if (!user) {
    return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
  }

  if (!classroom.studentIds.includes(user._id)) {
    classroom.studentIds.push(user._id);
    await classroom.save();
  }

  if (!user.classrooms?.includes(classroom._id)) {
    user.classrooms = [...(user.classrooms || []), classroom._id];
    await user.save();
  }

  return new Response(JSON.stringify({ message: "Joined classroom successfully" }), { status: 200 });
}
