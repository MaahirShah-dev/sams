import AttendanceDetailsClient from "./AttendanceDetailsClient";

export default async function AttendanceDetailsPage({ params }) {
  const { id } = await params; 
  return <AttendanceDetailsClient subjectId={id} />;
}
