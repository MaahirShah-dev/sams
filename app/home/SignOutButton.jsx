"use client";

import { signOut } from "next-auth/react";
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

export default function SignOutButton() {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button
          className="px-5 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 
          text-white font-semibold shadow-lg transition-all duration-200 hover:scale-105"
        >
          Sign out
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent className="rounded-2xl shadow-2xl">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-lg font-bold">
            Are you sure you want to sign out?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-gray-600">
            You will be logged out and redirected to the landing page.
            Make sure you’ve saved any work before signing out.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => signOut({ callbackUrl: "/" })}
            className="rounded-xl bg-red-500 text-white hover:bg-red-600"
          >
            Sign out
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
