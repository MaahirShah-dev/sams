"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { useSession } from "next-auth/react";
import { Loader2 } from "lucide-react";
import ClassroomHeader from "./ClassroomHeader";
import StudentsCard from "./StudentsCard";
import OverallStatsCard from "./OverallStatsCard";
import SubjectsSection from "./SubjectsSection";

export default function ClassroomPage({ classroomId }) {
  const { data: session } = useSession();
  const [classroom, setClassroom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [subjects, setSubjects] = useState([]);
  const [subjectName, setSubjectName] = useState("");
  const [overallStats, setOverallStats] = useState(null);
  const [subjectStats, setSubjectStats] = useState({});
  const router = useRouter();

  const isTeacher = session?.user?.email && classroom?.teacher?.email === session.user.email;

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`/api/classrooms/${classroomId}`, { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          setClassroom(data);
          const subRes = await fetch(`/api/subjects?classroomCode=${data.code}`);
          if (subRes.ok) setSubjects(await subRes.json());
        } else toast.error("Failed to load classroom");
      } catch {
        toast.error("Error fetching classroom");
      }
      setLoading(false);
    })();
  }, [classroomId]);

  useEffect(() => {
    if (!session?.user || !classroom || subjects.length === 0) return;
    const thisStudent = classroom.students.find((s) => s.email === session.user.email);
    if (!thisStudent?._id) return;
    const studentId = thisStudent._id;

    (async () => {
      try {
        const res = await fetch(`/api/attendance/student/overall/${classroomId}?studentId=${studentId}`);
        if (res.ok) setOverallStats(await res.json());
        let statsMap = {};
        for (let sub of subjects) {
          const subRes = await fetch(`/api/attendance/student/${sub._id}?studentId=${studentId}`);
          if (subRes.ok) statsMap[sub._id] = await subRes.json();
        }
        setSubjectStats(statsMap);
      } catch (err) {
        console.error(err);
      }
    })();
  }, [classroom, subjects, session?.user, classroomId]);

  const deleteClassroom = async () => {
    setDeleting(true);
    try {
      const res = await fetch(`/api/classrooms/${classroomId}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Classroom deleted!");
        setTimeout(() => router.push("/home"), 1200);
      } else {
        const err = await res.json().catch(() => ({}));
        toast.error(err.error || "Failed to delete classroom");
      }
    } catch {
      toast.error("Error deleting classroom");
    }
    setDeleting(false);
  };

  const addSubject = async () => {
    if (!subjectName.trim()) return toast.error("Enter subject name");
    try {
      const res = await fetch("/api/subjects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: subjectName, classroomCode: classroom.code }),
      });
      if (res.ok) {
        const subRes = await fetch(`/api/subjects?classroomCode=${classroom.code}`);
        if (subRes.ok) setSubjects(await subRes.json());
        setSubjectName("");
        toast.success("Subject added!");
      } else {
        const err = await res.json().catch(() => ({}));
        toast.error(err.error || "Failed to add subject");
      }
    } catch {
      toast.error("Error adding subject");
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );

  if (!classroom)
    return (
      <main className="flex h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100">
        <p className="p-6 text-gray-700 text-lg bg-white shadow-md rounded-xl">
          Classroom not found.
        </p>
      </main>
    );

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 px-6 py-10">
      <Toaster />
      <ClassroomHeader
        classroom={classroom}
        isTeacher={isTeacher}
        deleting={deleting}
        deleteClassroom={deleteClassroom}
      />
      <section className="max-w-4xl mx-auto mt-8">
        <StudentsCard students={classroom.students} isTeacher={isTeacher} />
        <OverallStatsCard overallStats={overallStats} />
        <SubjectsSection
          subjects={subjects}
          subjectStats={subjectStats}
          isTeacher={isTeacher}
          subjectName={subjectName}
          setSubjectName={setSubjectName}
          addSubject={addSubject}
        />
      </section>
    </main>
  );
}
