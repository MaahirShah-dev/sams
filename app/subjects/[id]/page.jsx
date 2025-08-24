"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import TeacherSubjectUI from "./TeacherSubjectUI";
import StudentSubjectUI from "./StudentSubjectUI";
import { Loader2 } from "lucide-react";

export default function SubjectPage({ params }) {
  const { id } = use(params);
  const [subject, setSubject] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        const [subjectRes, sessionRes] = await Promise.all([
          fetch(`/api/subjects/${id}`, { cache: "no-store" }),
          fetch("/api/auth/session"),
        ]);

        if (subjectRes.ok) {
          setSubject(await subjectRes.json());
        } else if (subjectRes.status === 404) {
          toast.error("Subject not found");
          router.back();
        }

        if (sessionRes.ok) {
          const session = await sessionRes.json();
          setRole(session?.user?.role || null);
        }
      } catch (err) {
        console.error("Error fetching subject", err);
        toast.error("Failed to load subject");
      } finally {
        setLoading(false);
      }
    })();
  }, [id, router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (!subject) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
        <p className="text-gray-600 text-center">
          Subject not found or could not be loaded.
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen  bg-gradient-to-br from-blue-50 via-white to-blue-100">
      <div className="max-w-4xl mx-auto p-6">
        <Toaster />
        {role === "teacher" ? (
          <TeacherSubjectUI subject={subject} />
        ) : (
          <StudentSubjectUI
            subject={subject}
            studentId={subject.currentStudentId}
          />
        )}
      </div>
    </main>
  );
}
