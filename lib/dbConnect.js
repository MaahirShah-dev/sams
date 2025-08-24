import mongoose from "mongoose";

let isConnected = false; 

export default async function dbConnect() {
  if (isConnected) {
    return;
  }

  if (mongoose.connection.readyState >= 1) {
    isConnected = true;
    return;
  }

  await mongoose.connect(process.env.MONGODB_URI, {
    dbName: process.env.MONGODB_DB || "attendance_db",
  });

  isConnected = true;
  console.log("✅ MongoDB connected");
}
