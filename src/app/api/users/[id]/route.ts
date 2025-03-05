import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

interface RouteContext {
  params: { id: string }
}

// PUT: Обновление пользователя
export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    const id = parseInt(context.params.id);
    const { email, password } = await request.json();

    const updateData: { email?: string; password?: string } = {};
    if (email) updateData.email = email;
    if (password) {
      const saltRounds = 10;
      updateData.password = await bcrypt.hash(password, saltRounds);
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(updatedUser, {
      headers: { 'Access-Control-Allow-Origin': '*' },
    });
  } catch (error) {
    console.error('Ошибка при обновлении пользователя:', error);
    return NextResponse.json({ error: 'Ошибка при обновлении пользователя' }, { status: 500 });
  }
}

// DELETE: Удаление пользователя
export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    const id = parseInt(context.params.id);
    await prisma.user.delete({ where: { id } });
    return NextResponse.json({ message: 'Пользователь удалён' }, {
      headers: { 'Access-Control-Allow-Origin': '*' },
    });
  } catch (error) {
    console.error('Ошибка при удалении пользователя:', error);
    return NextResponse.json({ error: 'Ошибка при удалении пользователя' }, { status: 500 });
  }
}
