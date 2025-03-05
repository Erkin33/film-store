// app/api/users/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

// Обработка preflight-запроса (OPTIONS)
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

// GET: Получение списка пользователей
export async function GET() {
  try {
    const users = await prisma.user.findMany();
    return NextResponse.json(users, {
      headers: { 'Access-Control-Allow-Origin': '*' },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}

// POST: Создание нового пользователя с хэшированием пароля
export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Отсутствуют обязательные поля email или password' },
        { status: 400 }
      );
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = await prisma.user.create({
      data: { email, password: hashedPassword },
    });

    return new NextResponse(JSON.stringify(newUser), {
      status: 201,
      headers: { 'Access-Control-Allow-Origin': '*' },
    });
  } catch (error: any) {
    if (error.code === 'P2002') {
      return new NextResponse(
        JSON.stringify({ error: 'Пользователь с таким email уже существует' }),
        { status: 409 }
      );
    }
    console.error('Ошибка при создании пользователя:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Ошибка при создании пользователя' }),
      { status: 500 }
    );
  }
}
