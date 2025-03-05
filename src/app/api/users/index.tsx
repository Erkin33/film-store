// pages/api/users/index.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Устанавливаем CORS-заголовки
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Обработка preflight-запроса (OPTIONS)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    // Получение списка пользователей
    try {
      const users = await prisma.user.findMany();
      res.status(200).json(users);
    } catch (error) {
      console.error('Ошибка при получении пользователей:', error);
      res.status(500).json({ error: 'Ошибка сервера' });
    }
  } else if (req.method === 'POST') {
    // Создание нового пользователя с хэшированием пароля
    try {
      const { email, password } = req.body;

      // Простая валидация
      if (!email || !password) {
        res.status(400).json({ error: 'Отсутствуют обязательные поля email или password' });
        return;
      }

      // Хэширование пароля
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Создание пользователя в базе с хэшированным паролем
      const newUser = await prisma.user.create({
        data: { 
          email, 
          password: hashedPassword,
        },
      });

      res.status(201).json(newUser);
    } catch (error) {
      console.error('Ошибка при создании пользователя:', error);
      res.status(500).json({ error: 'Ошибка при создании пользователя' });
    }
  } else {
    // Если метод не GET и не POST – метод не разрешён
    res.status(405).json({ message: 'Метод не разрешён' });
  }
}
