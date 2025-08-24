"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, User, BookOpen } from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Label,
} from "recharts";

export default function StudentSubjectUI({ subject, studentId }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        const query = studentId ? `?studentId=${studentId}` : "";
        const res = await fetch(
          `/api/attendance/student/${subject._id}${query}`,
          { credentials: "include" }
        );

        if (res.ok) {
          setStats(await res.json());
        } else {
          const err = await res.json().catch(() => ({}));
          toast.error(err.error || "Failed to fetch attendance");
        }
      } catch (err) {
        console.error("Error fetching attendance", err);
        toast.error("Error fetching attendance");
      } finally {
        setLoading(false);
      }
    })();
  }, [subject._id, studentId]);

  const COLORS = ["#16a34a", "#dc2626"];

  return (
    <div className="space-y-6">
      <Card className="rounded-2xl shadow-md gap-1">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl font-bold">
            <BookOpen className="h-6 w-6 text-blue-600" />
            {subject.name}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-gray-700">
            <User className="h-5 w-5 text-gray-500" />
            {subject.teacher ? (
              <p className="font-medium">{subject.teacher.name}</p>
            ) : (
              <p className="italic text-gray-500">No teacher assigned</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl shadow-md bg-white">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            Attendance Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading && (
            <div className="flex items-center gap-2 text-gray-500">
              <Loader2 className="h-4 w-4 animate-spin" /> Loading...
            </div>
          )}

          {!loading && stats && (
            <div className="grid md:grid-cols-2 gap-6 items-center">
              <div className="h-48">
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={[
                        { name: "Attended", value: stats.attended },
                        { name: "Missed", value: stats.missed },
                      ]}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      stroke="none"
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {COLORS.map((c, i) => (
                        <Cell key={i} fill={c} />
                      ))}
                      <Label
                        value={`${stats.percentage}%`}
                        position="center"
                        className={`text-xl font-bold ${stats.percentage < 75
                            ? "fill-red-600"
                            : "fill-green-600"
                          }`}
                      />
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-2">
                <p className="text-gray-700">
                  Total Lectures:{" "}
                  <span className="font-semibold">{stats.totalLectures}</span>
                </p>
                <p className="text-gray-700">
                  Attended:{" "}
                  <span className="font-semibold text-green-700">
                    {stats.attended}
                  </span>
                </p>
                <p className="text-gray-700">
                  Missed:{" "}
                  <span className="font-semibold text-red-700">
                    {stats.missed}
                  </span>
                </p>
                {stats.percentage < 75 && (
                  <p className="mt-2 text-red-700 font-medium text-sm">
                    You need to attend the next{" "}
                    <b>{stats.neededToReach75}</b> lectures to reach the acceptable limit.
                  </p>
                )}
              </div>
            </div>
          )}

          {!loading && !stats && (
            <p className="text-gray-500 italic">
              No attendance records available yet.
            </p>
          )}

          {!loading && stats && (
            <div className="mt-6 flex justify-end">
              <Button
                onClick={() =>
                  router.push(
                    `/subjects/${subject._id}/attendance?studentId=${studentId}`
                  )
                }
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
              >
                View Details
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
