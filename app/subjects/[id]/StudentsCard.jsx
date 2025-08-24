"use client";

import { useState } from "react";
import { Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function StudentsCard({ students }) {
  const [showDialog, setShowDialog] = useState(false);
  const limit = 5;
  const visible = students.slice(0, limit);
  const extra = students.length - limit;

  return (
    <div className="p-5 bg-white shadow rounded-2xl border">
      <h2 className="font-semibold text-lg mb-3 flex items-center gap-2">
        <Users className="w-5 h-5 text-blue-600" />
        Students
      </h2>
      <ul className="list-disc ml-6 text-gray-700 space-y-1">
        {visible.length > 0 ? (
          visible.map((s) => (
            <li key={s._id}>
              {s.name} <span className="text-sm text-gray-500">({s.email})</span>
            </li>
          ))
        ) : (
          <li className="text-gray-500">No students enrolled yet.</li>
        )}
      </ul>

      {extra > 0 && (
        <>
          <Button
            variant="outline"
            className="mt-3 rounded-xl"
            onClick={() => setShowDialog(true)}
          >
            View all {students.length}
          </Button>

          <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
            <AlertDialogContent className="rounded-2xl max-w-lg">
              <AlertDialogHeader>
                <AlertDialogTitle>All Students</AlertDialogTitle>
              </AlertDialogHeader>
              <div className="max-h-80 overflow-y-auto mt-2">
                <ul className="list-disc ml-6 text-gray-700 space-y-1">
                  {students.map((s) => (
                    <li key={s._id}>
                      {s.name}{" "}
                      <span className="text-sm text-gray-500">({s.email})</span>
                    </li>
                  ))}
                </ul>
              </div>
              <AlertDialogFooter>
                <AlertDialogCancel className="rounded-xl">Close</AlertDialogCancel>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      )}
    </div>
  );
}
