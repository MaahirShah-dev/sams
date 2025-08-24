"use client";

import Link from "next/link";
import { BookOpen, Plus, ChevronRight } from "lucide-react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PieChart, Pie, Cell } from "recharts";

export default function SubjectsSection({
  subjects = [],
  subjectStats = {},
  isTeacher,
  subjectName,
  setSubjectName,
  addSubject,
}) {
  const REQUIRED_PERCENTAGE = 75; 

  const calculateNeededLectures = (attended, total, requiredPercentage) => {
    if (total === 0) return null;

    let needed = 0;
    let newAttended = attended;
    let newTotal = total;

    while ((newAttended / newTotal) * 100 < requiredPercentage) {
      needed++;
      newAttended++;
      newTotal++;
      if (needed > 1000) break; 
    }

    return needed > 0 ? needed : null;
  };

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-blue-600" />
          <h2 className="font-semibold text-lg">Subjects</h2>
        </div>
        {isTeacher && (
          <Dialog>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2 rounded-xl shadow bg-blue-600 hover:bg-blue-700 text-white">
                <Plus className="w-4 h-4" />
                New Subject
              </Button>
            </DialogTrigger>
            <DialogContent className="rounded-2xl">
              <DialogHeader>
                <DialogTitle>Add a Subject</DialogTitle>
                <DialogDescription>
                  Enter the name of the subject you want to add to this classroom.
                </DialogDescription>
              </DialogHeader>
              <Input
                placeholder="e.g. Physics"
                value={subjectName}
                onChange={(e) => setSubjectName(e.target.value)}
                className="mt-2"
              />
              <DialogFooter>
                <Button
                  onClick={addSubject}
                  className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl"
                >
                  Add
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        {subjects.length > 0 ? (
          subjects.map((sub) => {
            const stats = subjectStats[sub._id];
            const percentage = stats?.percentage || 0;

            const COLORS =
              percentage < REQUIRED_PERCENTAGE
                ? ["#dc2626", "#e5e7eb"] 
                : ["#2563eb", "#e5e7eb"]; 

            const data = [
              { name: "Present", value: percentage },
              { name: "Absent", value: 100 - percentage },
            ];

            const neededToReach =
              stats && percentage < REQUIRED_PERCENTAGE
                ? calculateNeededLectures(
                    stats.attended,
                    stats.totalLectures,
                    REQUIRED_PERCENTAGE
                  )
                : null;

            return (
              <Link
                key={sub._id}
                href={`/subjects/${sub._id}`}
                className="p-5 bg-white rounded-2xl shadow hover:shadow-md transition flex flex-col border border-gray-100"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-blue-600" />
                    <h3 className="font-semibold text-lg text-gray-900">
                      {sub.name}
                    </h3>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </div>

                {stats && (
                  <div className="mt-4 flex items-center gap-4">
                    <PieChart width={90} height={90}>
                      <Pie
                        data={data}
                        innerRadius={28}
                        outerRadius={38}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {data.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index]} />
                        ))}
                      </Pie>
                    </PieChart>

                    <div className="flex-1">
                      <p className="text-sm text-gray-600">Attendance</p>
                      <p
                        className={`text-xl font-bold ${
                          percentage < REQUIRED_PERCENTAGE
                            ? "text-red-600"
                            : "text-blue-600"
                        }`}
                      >
                        {percentage}%
                      </p>
                      <p className="text-xs text-gray-500">
                        {stats.attended}/{stats.totalLectures} lectures
                      </p>

                      {neededToReach && (
                        <p className="text-xs mt-1 text-red-600 font-medium">
                          Attend next <b>{neededToReach}</b> lecture
                          {neededToReach > 1 ? "s" : ""} to reach the acceptable
                          limit.
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </Link>
            );
          })
        ) : (
          <p className="text-gray-500">No subjects yet.</p>
        )}
      </div>
    </div>
  );
}
