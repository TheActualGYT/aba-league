import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

// Hardcoded users for Vercel (file system is read-only)
const USERS = [
  { id: "1", username: "garrett", password: "password123", name: "Garrett" },
  { id: "2", username: "dad", password: "password123", name: "Dad" },
  { id: "3", username: "uncle", password: "password123", name: "Uncle" },
];

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any) {
        if (!credentials?.username || !credentials?.password) return null;
        const user = USERS.find(u => u.username === credentials.username && u.password === credentials.password);
        if (user) {
          return { id: user.id, name: user.name, username: user.username };
        }
        return null;
      },
    }),
  ],
  session: { strategy: "jwt" as const },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.id = user.id;
        token.username = user.username;
      }
      return token;
    },
    async session({ session, token }: any) {
      if (session.user) {
        session.user.id = token.id;
        session.user.username = token.username;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET || "super-secret-key-change-me",
};