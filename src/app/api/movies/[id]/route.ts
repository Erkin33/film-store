// @ts-nocheck
// app/api/movies/[id]/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// PUT: Обновление фильма
export async function PUT(request: Request, context: any) {
  try {
    const { id } = context.params;
    const parsedId = parseInt(id);
    const { title, year, genre } = await request.json();

    const updateData: { title?: string; year?: number; genre?: string } = {};
    if (title) updateData.title = title;
    if (year) updateData.year = year;
    if (genre) updateData.genre = genre;

    const updatedMovie = await prisma.movie.update({
      where: { id: parsedId },
      data: updateData,
    });

    return NextResponse.json(updatedMovie, {
      headers: { 'Access-Control-Allow-Origin': '*' },
    });
  } catch (error) {
    console.error('Ошибка при обновлении фильма:', error);
    return NextResponse.json({ error: 'Ошибка при обновлении фильма' }, { status: 500 });
  }
}

// DELETE: Удаление фильма
export async function DELETE(request: Request, context: any) {
  try {
    const { id } = context.params;
    const parsedId = parseInt(id);
    await prisma.movie.delete({
      where: { id: parsedId },
    });
    return NextResponse.json({ message: 'Фильм удалён' }, {
      headers: { 'Access-Control-Allow-Origin': '*' },
    });
  } catch (error) {
    console.error('Ошибка при удалении фильма:', error);
    return NextResponse.json({ error: 'Ошибка при удалении фильма' }, { status: 500 });
  }
}
