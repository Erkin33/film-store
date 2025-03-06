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
        email: { label: 'Email', type: 'text', placeholder: 'test@example.com' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // 1. Ищем пользователя в базе по email
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });
        if (!user) return null;

        // 2. Проверяем пароль
        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) return null;

        // 3. Возвращаем объект, который NextAuth воспримет как User:
        //    - Приводим id к строке
        //    - Не возвращаем password, createdAt, updatedAt
        return {
          id: String(user.id),
          email: user.email,
          name: user.name ?? user.email, // Или просто user.name
          // image: user.image // если в таблице есть поле image
        };
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      // Если хотим хранить id в session.user
      if (session.user && token.sub) {
        // Явно говорим TS, что user может иметь id
        (session.user as { id?: string }).id = token.sub;
      }
      return session;
    },
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
});
