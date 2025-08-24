  "use client";
  import { signIn, useSession } from "next-auth/react";
  import { useRouter } from "next/navigation";
  import { useEffect } from "react";

  export default function LandingPage() {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
      if (status === "authenticated") {
        if (session?.user?.role) {
          router.replace("/home");
        } else {
          router.replace("/select-role");
        }
      }
    }, [status, session, router]);

    return (
      <main className="flex flex-col items-center justify-center h-screen text-center 
        bg-gradient-to-br from-blue-200 via-white to-blue-200 px-6">

        <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 leading-tight">
          Track Attendance <br />
          <span className="text-blue-600">Effortlessly</span>
        </h1>

        <p className="mt-6 text-lg md:text-xl text-gray-600 max-w-2xl">
          Simplify classroom management. Automate attendance tracking.
          Stay organized with ease.
        </p>

        <div className="mt-10">
          <button
            onClick={() => signIn("google")}
            className="px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 
            text-white font-semibold shadow-lg transition duration-300 text-lg"
          >
            Sign in with Google
          </button>
        </div>
      </main>
    );
  }
