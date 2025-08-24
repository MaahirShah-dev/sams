"use client";

import { Loader2, Trash2 } from "lucide-react";
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

export default function ClassroomHeader({ classroom, isTeacher, deleting, deleteClassroom }) {
  return (
    <header className="flex items-center justify-between max-w-4xl mx-auto bg-white/80 backdrop-blur-md shadow-lg rounded-2xl px-8 py-5 border border-gray-200">
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
          {classroom.name}
        </h1>
        <p className="text-sm text-gray-600 mt-1">
          Code: <span className="font-medium text-gray-800">{classroom.code}</span>
        </p>
      </div>

      {isTeacher && (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              disabled={deleting}
              variant="destructive"
              className="flex items-center gap-2 rounded-xl shadow"
            >
              {deleting && <Loader2 className="w-4 h-4 animate-spin" />}
              <Trash2 className="w-4 h-4" />
              Delete
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="rounded-2xl">
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Classroom</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this classroom? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={deleteClassroom}
                className="bg-red-600 hover:bg-red-700 text-white rounded-xl"
              >
                Confirm Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </header>
  );
}
