"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";

export default function AddAttendanceModal({ subject, onClose, onSave }) {
  const [date, setDate] = useState("");
  const [lectures, setLectures] = useState(1);
  const [records, setRecords] = useState(
    subject.students.map((s) => ({
      studentId: s._id,
      status: "present",
    }))
  );
  const [saving, setSaving] = useState(false);

  const toggleStatus = (studentId) => {
    setRecords((prev) =>
      prev.map((r) =>
        r.studentId === studentId
          ? { ...r, status: r.status === "present" ? "absent" : "present" }
          : r
      )
    );
  };

  const save = async () => {
    if (!date) {
      toast.error("Please select a date");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(`/api/attendance`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subjectId: subject._id,
          classroomId: subject.classroomId,
          date,
          lectures,
          records,
        }),
      });
      if (res.ok) {
        const created = await res.json();
        toast.success("Attendance added");
        onSave(created);
      } else {
        toast.error("Failed to add attendance");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error adding attendance");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent
        className="max-w-xl rounded-2xl shadow-2xl"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader className="pb-3 border-b">
          <DialogTitle className="text-xl font-semibold text-green-700">
            Add Attendance
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-600">
            Mark attendance for <span className="font-medium">{subject.name}</span>
          </DialogDescription>
        </DialogHeader>

        {/* Date */}
        <div className="mt-4">
          <Label htmlFor="date" className="text-sm font-medium">
            Date
          </Label>
          <Input
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="mt-1 w-56"
          />
        </div>

        {/* Lectures */}
        <div className="mt-4">
          <Label htmlFor="lectures" className="text-sm font-medium">
            No. of Lectures
          </Label>
          <Input
            id="lectures"
            type="number"
            min={1}
            value={lectures}
            onChange={(e) => setLectures(Number(e.target.value))}
            className="mt-1 w-32"
          />
        </div>

        {/* Students list */}
        <div className="mt-5">
          <Label className="text-sm font-medium">Students</Label>
          <ul className="mt-2 space-y-3 max-h-64 overflow-y-auto border rounded p-3">
            {subject.students.map((s) => {
              const rec = records.find((r) => r.studentId === s._id);
              return (
                <li
                  key={s._id}
                  className="flex justify-between items-center border-b last:border-0 py-2"
                >
                  <span className="text-sm font-medium">{s.name}</span>
                  <div className="flex items-center gap-3">
                    <Badge
                      variant={
                        rec.status === "present" ? "success" : "destructive"
                      }
                      className="text-xs px-2 py-0.5 rounded-md"
                    >
                      {rec.status === "present" ? "Present" : "Absent"}
                    </Badge>
                    <Switch
                      checked={rec.status === "present"}
                      onCheckedChange={() => toggleStatus(s._id)}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Footer buttons */}
        <DialogFooter className="mt-6">
          <Button
            variant="outline"
            onClick={onClose}
            className="rounded-lg"
            disabled={saving}
          >
            Cancel
          </Button>
          <Button
            onClick={save}
            disabled={saving}
            className="bg-green-600 hover:bg-green-700 rounded-lg"
          >
            {saving ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
