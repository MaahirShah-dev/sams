"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Trash2 } from "lucide-react";

import TeacherCard from "./TeacherCard";
import StudentsCard from "./StudentsCard";
import AttendanceCardTwo from "./AttendanceCardTwo";
import EditAttendanceModal from "./EditAttendanceModal";
import AddAttendanceModal from "./AddAttendanceModal";

export default function TeacherSubjectUI({ subject }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);
  const [attendanceList, setAttendanceList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`/api/attendance?subjectId=${subject._id}`);
        if (res.ok) {
          setAttendanceList(await res.json());
        }
      } catch (err) {
        console.error("Error fetching attendance", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [subject._id]);

  const deleteSubject = async () => {
    setDeleting(true);
    try {
      const res = await fetch(`/api/subjects/${subject._id}`, { method: "DELETE" });
      if (res.ok) {
        const data = await res.json();
        toast.success("Subject deleted!");
        setTimeout(() => router.push(`/classrooms/${data.classroomId}`), 1200);
      }
    } catch {
      toast.error("Error deleting subject");
    }
    setDeleting(false);
  };

  const deleteAttendance = async (id) => {
    try {
      const res = await fetch(`/api/attendance/${id}`, { method: "DELETE" });
      if (res.ok) {
        setAttendanceList((prev) => prev.filter((a) => a._id !== id));
        toast.success("Attendance deleted");
      }
    } catch {
      toast.error("Error deleting attendance");
    }
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{subject.name}</h1>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" className="flex items-center gap-2 rounded-xl">
              <Trash2 className="w-4 h-4" />
              Delete
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="rounded-2xl">
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Subject</AlertDialogTitle>
              <AlertDialogDescription>
                This will remove the subject and all its records permanently.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={deleteSubject}
                className="bg-red-600 hover:bg-red-700 rounded-xl"
                disabled={deleting}
              >
                {deleting ? "Deleting..." : "Delete"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <TeacherCard teacher={subject.teacher} />
        <StudentsCard students={subject.students || []} />
      </div>

      <section className="mt-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Attendance Records</h2>
          <Button
            onClick={() => setAdding(true)}
            className="bg-green-600 hover:bg-green-700 text-white rounded-xl"
          >
            + Add Attendance
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center py-10">
            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : attendanceList.length === 0 ? (
          <p className="text-gray-500">No attendance recorded yet.</p>
        ) : (
          <div className="grid gap-4">
            {attendanceList.map((a) => (
              <AttendanceCardTwo
                key={a._id}
                attendance={a}
                onEdit={setEditing}
                onDelete={deleteAttendance}
              />
            ))}
          </div>
        )}
      </section>

      {editing && (
        <EditAttendanceModal
          attendance={editing}
          subject={subject}
          onClose={() => setEditing(null)}
          onSave={(updated) =>
            setAttendanceList((prev) =>
              prev.map((a) => (a._id === updated._id ? updated : a))
            )
          }
        />
      )}

      {adding && (
        <AddAttendanceModal
          subject={subject}
          onClose={() => setAdding(false)}
          onSave={(newA) => setAttendanceList((prev) => [...prev, newA])}
        />
      )}
    </>
  );
}
