import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, enum: ["teacher", "student"], default: null },
    image: { type: String },
    classrooms: [{ type: mongoose.Schema.Types.ObjectId, ref: "Classroom" }],
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", userSchema);
