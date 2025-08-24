"use client";

import { User2 } from "lucide-react";

export default function TeacherCard({ teacher }) {
  return (
    <div className="p-5 bg-white shadow rounded-2xl border">
      <h2 className="font-semibold text-lg mb-3 flex items-center gap-2">
        <User2 className="w-5 h-5 text-blue-600" />
        Teacher
      </h2>
      <p className="text-gray-700 font-medium">{teacher?.name}</p>
      <p className="text-sm text-gray-500">{teacher?.email}</p>
    </div>
  );
}
