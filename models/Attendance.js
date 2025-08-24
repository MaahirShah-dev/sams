import mongoose, { Schema } from "mongoose";

const AttendanceSchema = new Schema(
  {
    subjectId: { type: Schema.Types.ObjectId, ref: "Subject", required: true },
    classroomId: { type: Schema.Types.ObjectId, ref: "Classroom", required: true },
    date: { type: String, required: true }, 
    lectures: { type: Number, default: 1 }, 
    records: [
      {
        studentId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        status: { type: String, enum: ["present", "absent"], default: "present" },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.models.Attendance ||
  mongoose.model("Attendance", AttendanceSchema);
