import mongoose from "mongoose";

const SubjectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    classroomId: { type: mongoose.Schema.Types.ObjectId, ref: "Classroom", required: true },
    teacherId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Subject || mongoose.model("Subject", SubjectSchema);
