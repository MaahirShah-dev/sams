import dbConnect from "@/lib/dbConnect";
import Attendance from "@/models/Attendance";

export async function GET(req, context) {
  await dbConnect();

  const { classroomId } = await context.params;

  const { searchParams } = new URL(req.url);
  const studentId = searchParams.get("studentId");

  if (!studentId) {
    return new Response(JSON.stringify({ error: "Student ID required" }), {
      status: 400,
    });
  }

  const records = await Attendance.find({ classroomId }).lean();

  let totalLectures = 0;
  let attended = 0;

  records.forEach((a) => {
    totalLectures += a.lectures || 1;
    const rec = a.records.find((r) => String(r.studentId) === String(studentId));
    if (rec?.status === "present") {
      attended += a.lectures || 1;
    }
  });

  const missed = totalLectures - attended;
  const percentage =
    totalLectures > 0
      ? ((attended / totalLectures) * 100).toFixed(2)
      : 0;

  return new Response(
    JSON.stringify({
      totalLectures,
      attended,
      missed,
      percentage,
    }),
    { status: 200 }
  );
}
