import GoogleProvider from "next-auth/providers/google";
import dbConnect from "./mongodb";
import User from "../models/User";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account.provider === "google") {
        const { name, email, image } = user;
        try {
          await dbConnect();
          const userExists = await User.findOne({ email });

          if (!userExists) {
            await User.create({
              name,
              email,
              image,
              provider: "google",
            });
          }
          return true;
        } catch (error) {
          console.log(error);
          return false;
        }
      }
      return true;
    },
    async session({ session }) {
        try {
            await dbConnect();
            const user = await User.findOne({ email: session.user.email });
            if (user) {
                session.user.id = user._id.toString();
                // Also ensure image is up to date if needed, but skipping for now
            }
        } catch (e) {
            console.error(e);
        }
        return session;
    },
  },
  secret: process.env.JWT_SECRET,
};
