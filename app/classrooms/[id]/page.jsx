import ClassroomPage from "./ClassroomPage";

export default async function Page({ params }) {
  const { id } = await params; 
  return <ClassroomPage classroomId={id} />;
}
