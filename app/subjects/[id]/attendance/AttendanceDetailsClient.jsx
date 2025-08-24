"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2 } from "lucide-react";

export default function AttendanceDetailsClient({ subjectId }) {
  const searchParams = useSearchParams();
  const studentId = searchParams.get("studentId");

  const [lectures, setLectures] = useState([]);
  const [subject, setSubject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [subjectLoading, setSubjectLoading] = useState(true);

  useEffect(() => {
    if (!subjectId) return;

    (async () => {
      try {
        const res = await fetch(`/api/subjects/${subjectId}`);
        if (res.ok) {
          setSubject(await res.json());
        } else {
          const err = await res.json().catch(() => ({}));
          toast.error(err.error || "Failed to fetch subject details");
        }
      } catch (err) {
        console.error("Error fetching subject details", err);
        toast.error("Error fetching subject details");
      } finally {
        setSubjectLoading(false);
      }
    })();
  }, [subjectId]);

  useEffect(() => {
    if (!studentId) return;

    (async () => {
      try {
        const res = await fetch(
          `/api/attendance/student/${subjectId}/details?studentId=${studentId}`
        );
        if (res.ok) {
          setLectures(await res.json());
        } else {
          const err = await res.json().catch(() => ({}));
          toast.error(err.error || "Failed to fetch attendance details");
        }
      } catch (err) {
        console.error("Error fetching details", err);
        toast.error("Error fetching attendance details");
      } finally {
        setLoading(false);
      }
    })();
  }, [subjectId, studentId]);

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      <main className="max-w-4xl mx-auto p-6 space-y-6">
        <Card className="rounded-2xl shadow-md gap-1">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">
              Attendance Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            {subjectLoading ? (
              <div className="flex items-center gap-2 text-gray-500">
                <Loader2 className="h-4 w-4 animate-spin" /> Loading subject info...
              </div>
            ) : subject ? (
              <div className="space-y-1">
                <p className="text-gray-700 font-medium text-lg">
                  Subject: <span className="text-blue-600">{subject.name}</span>
                </p>
                {subject.teacher && (
                  <p className="text-gray-600">
                    Teacher:{" "}
                    <span className="font-medium">{subject.teacher.name}</span>
                  </p>
                )}
                {subject.description && (
                  <p className="text-gray-500 italic">{subject.description}</p>
                )}
              </div>
            ) : (
              <p className="text-gray-500 italic">
                No subject details found.
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-md">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Lecture-wise Record
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading && (
              <div className="flex items-center gap-2 text-gray-500">
                <Loader2 className="h-4 w-4 animate-spin" /> Loading records...
              </div>
            )}

            {!loading && lectures.length === 0 && (
              <p className="text-gray-500 italic">
                No attendance records available.
              </p>
            )}

            {!loading && lectures.length > 0 && (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[80px] text-center">No</TableHead>
                    <TableHead className="text-center">Date</TableHead>
                    <TableHead className="text-center">
                      Lectures Held
                    </TableHead>
                    <TableHead className="text-center">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {lectures.map((lec, idx) => (
                    <TableRow key={lec._id || idx}>
                      <TableCell className="text-center font-medium">
                        {idx + 1}
                      </TableCell>
                      <TableCell className="text-center">
                        {new Date(lec.date).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </TableCell>
                      <TableCell className="text-center">
                        {lec.lectures}
                      </TableCell>
                      <TableCell
                        className={`text-center font-semibold ${
                          lec.status === "present"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {lec.status === "present" ? "Present" : "Absent"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
