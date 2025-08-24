"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ChalkboardTeacher, GraduationCap } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function SelectRole() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status === "loading") return;
    if (!session?.user) {
      router.replace("/");
    }
  }, [status, session, router]);

  useEffect(() => {
    if (session?.user?.role) {
      router.replace("/home");
    }
  }, [session?.user?.role, router]);

  const setRole = async (role) => {
    try {
      setLoading(true);
      const res = await fetch("/api/set-role", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });

      if (res.ok) {
        await update({ role });
        router.replace("/home");
      } else {
        console.error("Failed to set role");
      }
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading") return <p>Loading...</p>;
  if (!session?.user) return null;
  if (session?.user?.role) return null;

  return (
    <main className="flex flex-col items-center justify-center h-screen px-4">
      <h1 className="text-3xl font-bold mb-8">Select Your Role</h1>
      <div className="grid gap-6 md:grid-cols-2 w-full max-w-3xl">
        <Card className="rounded-2xl shadow hover:shadow-md transition cursor-pointer">
          <CardHeader className="flex flex-col items-center">
            <div className="w-16 h-16 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 mb-3">
              <ChalkboardTeacher className="w-8 h-8" />
            </div>
            <CardTitle>Teacher</CardTitle>
          </CardHeader>
          <CardContent className="text-center text-gray-600">
            Create classrooms, manage students, and track attendance seamlessly.
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button
              onClick={() => setRole("teacher")}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl"
            >
              Continue as Teacher
            </Button>
          </CardFooter>
        </Card>

        <Card className="rounded-2xl shadow hover:shadow-md transition cursor-pointer">
          <CardHeader className="flex flex-col items-center">
            <div className="w-16 h-16 flex items-center justify-center rounded-full bg-green-100 text-green-600 mb-3">
              <GraduationCap className="w-8 h-8" />
            </div>
            <CardTitle>Student</CardTitle>
          </CardHeader>
          <CardContent className="text-center text-gray-600">
            Join classrooms, mark attendance, and stay connected with your teachers.
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button
              onClick={() => setRole("student")}
              disabled={loading}
              className="bg-green-600 hover:bg-green-700 text-white rounded-xl"
            >
              Continue as Student
            </Button>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
}
