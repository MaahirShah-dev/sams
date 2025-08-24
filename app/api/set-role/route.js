import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";

export async function POST(req) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    const { role } = await req.json();
    if (!["teacher", "student"].includes(role)) {
        return new Response(JSON.stringify({ error: "Invalid role" }), { status: 400 });
    }

    await dbConnect();

    const updatedUser = await User.findOneAndUpdate(
        { email: session.user.email },
        { role },
        { new: true, upsert: true }
    );

    return new Response(
        JSON.stringify({ success: true, role: updatedUser.role }),
        { status: 200 }
    );
}
