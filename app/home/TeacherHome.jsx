"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";
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

export default function TeacherHome() {
  const [name, setName] = useState("");
  const [classrooms, setClassrooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    (async () => {
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
    })();
  }, []);

  const createClassroom = async () => {
    if (!name.trim()) return toast.error("Please enter a classroom name");
    setCreating(true);
    const res = await fetch("/api/classrooms", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    if (res.ok) {
      const created = await res.json();
      toast.success("Classroom created!");
      setClassrooms((prev) => [...prev, created]);
      setName("");
    } else {
      const err = await res.json().catch(() => ({}));
      toast.error(err.error || "Failed to create classroom");
    }
    setCreating(false);
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
              New Classroom
            </Button>
          </DialogTrigger>
          <DialogContent className="rounded-2xl">
            <DialogHeader>
              <DialogTitle>Create a Classroom</DialogTitle>
              <DialogDescription>
                Enter a name for your classroom. Once created, share the join
                code with your students so they can enroll.
              </DialogDescription>
            </DialogHeader>
            <Input
              placeholder="e.g. Mathematics - Grade 10"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-2"
            />
            <DialogFooter>
              <Button
                onClick={createClassroom}
                disabled={creating}
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl"
              >
                {creating && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Create
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
          You haven’t created any classrooms yet. Start by creating your first one.
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {classrooms.map((c) => (
            <Link
              key={c._id}
              href={`/classrooms/${c._id}`}
              className="p-5 bg-white rounded-2xl shadow hover:shadow-md transition flex items-center gap-4 border border-gray-100"
            >
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-100 text-blue-600">
                <School className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">{c.name}</h3>
                <p className="text-sm text-gray-600">Code: {c.code}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
