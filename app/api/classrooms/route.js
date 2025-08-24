import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import Classroom from "@/models/Classroom";

async function generateUniqueCode() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; 
  const make = () =>
    Array.from({ length: 6 }, () => alphabet[Math.floor(Math.random() * alphabet.length)]).join("");

  let code = make();
  while (await Classroom.exists({ code })) code = make();
  return code;
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  await dbConnect();
  const dbUser = await User.findOne({ email: session.user.email });
  if (!dbUser) {
    return new Response(JSON.stringify([]), { status: 200 });
  }

  let classes = [];
  if (dbUser.role === "teacher") {
    classes = await Classroom.find({ teacherId: dbUser._id })
      .sort({ createdAt: 1 })
      .lean();
  } else if (dbUser.role === "student") {
    classes = await Classroom.find({ studentIds: dbUser._id })
      .sort({ createdAt: 1 })
      .lean();
  }

  return new Response(JSON.stringify(classes), { status: 200 });
}

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  const { name } = await req.json();
  if (!name || !name.trim()) {
    return new Response(JSON.stringify({ error: "Classroom name is required" }), { status: 400 });
  }

  await dbConnect();
  const dbUser = await User.findOne({ email: session.user.email });

  if (!dbUser || dbUser.role !== "teacher") {
    return new Response(JSON.stringify({ error: "Only teachers can create classrooms" }), { status: 403 });
  }

  const code = await generateUniqueCode();

  const classroom = await Classroom.create({
    name: name.trim(),
    code,
    teacherId: dbUser._id,
    studentIds: [],
  });

  await User.findByIdAndUpdate(
    dbUser._id,
    { $addToSet: { classrooms: classroom._id } }, 
    { new: true }
  );

  return new Response(JSON.stringify(classroom), { status: 201 });
}
