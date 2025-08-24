"use client";

import { Users } from "lucide-react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function StudentsCard({ students, isTeacher }) {
  if (!isTeacher) return null;

  return (
    <div className="bg-white rounded-2xl shadow p-5 border border-gray-100 mb-8">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-blue-600" />
          <h2 className="font-semibold text-lg">Students</h2>
        </div>
        {students.length > 3 && (
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                className="text-blue-600 hover:underline text-sm"
              >
                See all
              </Button>
            </DialogTrigger>
            <DialogContent className="rounded-2xl">
              <DialogHeader>
                <DialogTitle>All Students</DialogTitle>
                <DialogDescription>
                  List of all enrolled students in this classroom.
                </DialogDescription>
              </DialogHeader>
              <ul className="space-y-1 text-gray-700 max-h-80 overflow-y-auto">
                {students.map((s) => (
                  <li key={s._id}>
                    {s.name}{" "}
                    <span className="text-sm text-gray-500">({s.email})</span>
                  </li>
                ))}
              </ul>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {students?.length > 0 ? (
        <ul className="space-y-1 text-gray-700">
          {students.slice(0, 3).map((s) => (
            <li key={s._id}>
              {s.name}{" "}
              <span className="text-sm text-gray-500">({s.email})</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">No students yet.</p>
      )}
    </div>
  );
}
