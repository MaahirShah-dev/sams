import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { redirect } from "next/navigation";
import TeacherHome from "./TeacherHome";
import StudentHome from "./StudentHome";
import Image from "next/image";
import SignOutButton from "./SignOutButton";

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/");
  }

  await dbConnect();
  const dbUser = await User.findOne({ email: session.user.email }).lean();

  if (!dbUser) {
    return (
      <main className="flex h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100">
        <p className="p-6 text-gray-700 text-lg bg-white shadow-md rounded-xl">
          User not found. Please sign in again.
        </p>
      </main>
    );
  }

  if (!dbUser.role) {
    redirect("/select-role");
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 px-6 py-10">
      <header className="flex items-center justify-between max-w-6xl mx-auto bg-white/80 backdrop-blur-md shadow-lg rounded-2xl px-8 py-5 border border-gray-200">
        <div className="flex items-center gap-4">
          {dbUser.image && (
            <Image
              src={dbUser.image}
              alt={dbUser.name}
              width={56}
              height={56}
              className="rounded-full shadow-md ring-2 ring-blue-200"
            />
          )}
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
              Welcome back,{" "}
              <span className="text-blue-600">{dbUser.name}</span>
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Logged in as{" "}
              <span className="capitalize font-medium text-gray-800">
                {dbUser.role}
              </span>
            </p>
          </div>
        </div>

        <SignOutButton />
      </header>

      <section className="mt-12 max-w-6xl mx-auto">
        {dbUser.role === "teacher" ? (
          <TeacherHome userId={dbUser._id.toString()} />
        ) : (
          <StudentHome userId={dbUser._id.toString()} />
        )}
      </section>
    </main>
  );
}
