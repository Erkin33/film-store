import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "text", placeholder: "test@example.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // Найти пользователя по email
        const user = await prisma.user.findUnique({
          where: { email: credentials?.email },
        });
        if (!user) return null;
        // Сравнить пароль
        const isValid = await bcrypt.compare(credentials!.password, user.password);
        if (!isValid) return null;
        return user;
      }
    })
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async session({ session, token, user }) {
      // Можно добавить дополнительные поля в сессию, например, id пользователя
      if (token && session.user) {
        session.user.id = token.sub;
      }
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
});
