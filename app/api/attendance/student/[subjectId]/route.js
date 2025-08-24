import dbConnect from "@/lib/dbConnect";
import Attendance from "@/models/Attendance";

export async function GET(req, context) {
  await dbConnect();

  const { subjectId } = await context.params;

  const { searchParams } = new URL(req.url);
  const studentId = searchParams.get("studentId");

  if (!studentId) {
    return new Response(
      JSON.stringify({ error: "StudentId required" }),
      { status: 400 }
    );
  }

  const attendance = await Attendance.find({ subjectId }).lean();

  let totalLectures = 0;
  let attended = 0;

  attendance.forEach((a) => {
    const lectures = a.lectures || 1;
    totalLectures += lectures;

    const rec = a.records.find(
      (r) => String(r.studentId) === String(studentId)
    );
    if (rec?.status === "present") {
      attended += lectures;
    }
  });

  const missed = totalLectures - attended;
  const percentage =
    totalLectures > 0
      ? ((attended / totalLectures) * 100).toFixed(2)
      : 0;

  let neededToReach75 = 0;
  if (percentage < 75) {
    while (
      ((attended + neededToReach75) /
        (totalLectures + neededToReach75)) *
        100 < 75
    ) {
      neededToReach75++;
    }
  }

  return new Response(
    JSON.stringify({
      studentId,
      subjectId,
      totalLectures,
      attended,
      missed,
      percentage: Number(percentage),
      neededToReach75,
    }),
    { status: 200 }
  );
}
