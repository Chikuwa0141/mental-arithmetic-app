import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from '../../../../lib/prisma'; // ← 使い回しのPrismaClientを使う
import bcrypt from "bcrypt";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) return null;

        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
        };
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub; // ← user.id をセッションに含める
      }
      return session;
    },
  },
  session: {
    strategy: "jwt", // ← DBなしのセッション方式（必要なら"database"にもできる）
  },
  pages: {
    signIn: "/login", // ログイン画面があるなら指定（任意）
  },
});

export { handler as GET, handler as POST };
