"use client";

import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import Link from "next/link";
import { Plus, Loader2, School } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function StudentHome() {
  const [classrooms, setClassrooms] = useState([]);
  const [classroomCode, setClassroomCode] = useState("");
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);

  const fetchClassrooms = async () => {
    try {
      const res = await fetch("/api/classrooms", { cache: "no-store" });
      if (res.ok) {
        setClassrooms(await res.json());
      }
    } catch (e) {
      toast.error("Failed to load classrooms");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClassrooms();
  }, []);

  const joinClassroom = async () => {
    if (!classroomCode.trim()) {
      toast.error("Please enter a classroom code");
      return;
    }

    setJoining(true);
    try {
      const res = await fetch("/api/classrooms/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ classroomCode }),
      });

      if (res.ok) {
        toast.success("Joined classroom successfully!");
        setClassroomCode("");
        fetchClassrooms();
      } else {
        const err = await res.json().catch(() => ({}));
        toast.error(err.error || "Failed to join classroom");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setJoining(false);
    }
  };

  return (
    <section className="mt-6">
      <Toaster />
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Your Classrooms</h2>

        <Dialog>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2 rounded-xl shadow bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="w-4 h-4" />
              Join Classroom
            </Button>
          </DialogTrigger>
          <DialogContent className="rounded-2xl">
            <DialogHeader>
              <DialogTitle>Join a Classroom</DialogTitle>
              <DialogDescription>
                Enter the classroom code shared by your teacher to join.
              </DialogDescription>
            </DialogHeader>
            <Input
              placeholder="e.g. ABC123"
              value={classroomCode}
              onChange={(e) => setClassroomCode(e.target.value)}
              className="mt-2"
            />
            <DialogFooter>
              <Button
                onClick={joinClassroom}
                disabled={joining}
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl"
              >
                {joining && (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                )}
                Join
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-10">
          <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
        </div>
      ) : classrooms.length === 0 ? (
        <p className="text-gray-500 text-center py-10">
          You haven’t joined any classrooms yet. Use the button above to join one!
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {classrooms.map((c) => (
            <Link
              key={c._id}
              href={`/classrooms/${c._id}`}
              className="p-5 bg-white rounded-2xl shadow hover:shadow-md transition flex items-center gap-4 border border-gray-100"
            >
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-green-100 text-green-600">
                <School className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">{c.name}</h3>
                <p className="text-sm text-gray-600">
                  Joined on {new Date(c.createdAt).toLocaleDateString()}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
