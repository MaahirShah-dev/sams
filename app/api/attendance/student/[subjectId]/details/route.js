import dbConnect from "@/lib/dbConnect";
import Attendance from "@/models/Attendance";

export async function GET(req, { params }) {
  await dbConnect();

  const { subjectId } = await params; 

  const { searchParams } = new URL(req.url);
  const studentId = searchParams.get("studentId");

  if (!studentId) {
    return new Response(JSON.stringify({ error: "Missing studentId" }), {
      status: 400,
    });
  }

  const records = await Attendance.find({ subjectId }).lean();

  const details = records.map((a) => {
    const rec = a.records.find(
      (r) => String(r.studentId) === String(studentId)
    );
    return {
      _id: a._id,
      date: a.date,
      lectures: a.lectures || 1,
      status: rec?.status || "absent", 
    };
  });

  return new Response(JSON.stringify(details), { status: 200 });
}
