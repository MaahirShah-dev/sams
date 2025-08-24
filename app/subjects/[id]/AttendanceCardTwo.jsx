"use client";

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
import { CalendarDays } from "lucide-react";

export default function AttendanceCardTwo({ attendance, onEdit, onDelete }) {
  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const totalPresent = attendance.records.filter((r) => r.status === "present").length;
  const totalAbsent = attendance.records.filter((r) => r.status === "absent").length;

  return (
    <div className="p-5 bg-white shadow rounded-2xl border flex justify-between items-center">
      <div>
        <p className="font-medium flex items-center gap-2">
          <CalendarDays className="w-4 h-4 text-blue-600" />
          {formatDate(attendance.date)}
        </p>
        <p className="text-sm text-gray-600">
          {attendance.lectures} {attendance.lectures > 1 ? "lectures" : "lecture"}
        </p>
        <p className="text-sm text-gray-600">
          Present: {totalPresent}, Absent: {totalAbsent}
        </p>
      </div>
      <div className="flex gap-2">
        <Button
          onClick={() => onEdit(attendance)}
          className="bg-yellow-500 hover:bg-yellow-600 text-white rounded-xl"
        >
          Edit
        </Button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" className="rounded-xl">
              Delete
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="rounded-2xl">
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Attendance</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this attendance record?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => onDelete(attendance._id)}
                className="bg-red-600 hover:bg-red-700 rounded-xl"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
