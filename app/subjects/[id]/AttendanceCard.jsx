"use client";

export default function AttendanceCard({ attendance, onEdit, onDelete }) {
  const totalPresent = attendance.records.filter((r) => r.status === "present").length;
  const totalAbsent = attendance.records.filter((r) => r.status === "absent").length;

  return (
    <div className="p-4 border rounded bg-white shadow flex justify-between items-center">
      <div>
        <p className="font-medium">
          Date: {attendance.date} ({attendance.lectures} lecture
          {attendance.lectures > 1 ? "s" : ""})
        </p>
        <p className="text-sm text-gray-600">
          Present: {totalPresent}, Absent: {totalAbsent}
        </p>
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => onEdit(attendance)}
          className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(attendance._id)}
          className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
