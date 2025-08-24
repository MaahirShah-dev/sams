"use client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function OverallAttendance({ classroomId, studentId }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(
          `/api/attendance/student/overall/${classroomId}?studentId=${studentId}`
        );
        if (res.ok) {
          setStats(await res.json());
        } else {
          const err = await res.json().catch(() => ({}));
          toast.error(err.error || "Failed to fetch overall attendance");
        }
      } catch (err) {
        console.error("Error fetching overall attendance", err);
        toast.error("Error fetching overall attendance");
      } finally {
        setLoading(false);
      }
    })();
  }, [classroomId, studentId]);

  if (loading) return <p className="text-gray-500">Loading...</p>;
  if (!stats) return <p className="text-gray-500">No attendance data.</p>;

  return (
    <div className="p-4 border rounded shadow bg-white">
      <h2 className="font-semibold mb-2">Your Overall Attendance</h2>
      <p>Total Lectures: {stats.totalLectures}</p>
      <p>Attended: {stats.attended}</p>
      <p>Missed: {stats.missed}</p>
      <p>
        Percentage:{" "}
        <span
          className={
            stats.percentage < 75
              ? "text-red-600 font-bold"
              : "text-green-600 font-bold"
          }
        >
          {stats.percentage}%
        </span>
      </p>
    </div>
  );
}
