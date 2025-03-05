// pages/api/auth/[...nextauth].ts
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
      async authorize(credentials, req) {
        // Найти пользователя по email
        const user = await prisma.user.findUnique({
          where: { email: credentials?.email },
        });
        if (!user) return null;

        // Сравнить пароль
        const isValid = await bcrypt.compare(credentials!.password, user.password);
        if (!isValid) return null;

        // Возвращаем объект, соответствующий требованиям NextAuth
        return {
          id: String(user.id), // id должно быть строкой
          email: user.email,
          // name: user.name || null, // если есть поле name
        };
      }
    })
  ],
  callbacks: {
    async session({ session, token, user }) {
      // Можно добавить дополнительные поля в сессию, если нужно
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
});
