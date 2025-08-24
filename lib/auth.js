import GoogleProvider from "next-auth/providers/google";
import User from "@/models/User";
import dbConnect from "@/lib/dbConnect";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],

  callbacks: {
    async signIn({ user, profile }) {
      await dbConnect();

      let dbUser = await User.findOne({ email: user.email });

      if (!dbUser) {
        dbUser = await User.create({
          email: user.email,
          name: user.name || profile.name,
          image: user.image || profile.picture,
          role: null, 
        });
      } else {
        let updated = false;
        if (!dbUser.name && (user.name || profile.name)) {
          dbUser.name = user.name || profile.name;
          updated = true;
        }
        if (!dbUser.image && (user.image || profile.picture)) {
          dbUser.image = user.image || profile.picture;
          updated = true;
        }
        if (updated) await dbUser.save();
      }

      return true; 
    },

    async jwt({ token, user, trigger, session }) {
      if (user?.email) {
        await dbConnect();
        const dbUser = await User.findOne({ email: user.email }).lean();
        token.role = dbUser?.role || null;
      }

      if (trigger === "update" && session?.role) {
        token.role = session.role;
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role || null;
      }
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
};
