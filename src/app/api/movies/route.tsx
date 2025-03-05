// app/api/movies/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

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

export async function GET() {
  try {
    const movies = await prisma.movie.findMany();
    return NextResponse.json(movies, {
      headers: { 'Access-Control-Allow-Origin': '*' },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Ошибка получения фильмов' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { title, year, genre, coverUrl, description } = await request.json();

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    const newMovie = await prisma.movie.create({
      data: { title, year, genre, coverUrl, description },
    });

    return new NextResponse(JSON.stringify(newMovie), {
      status: 201,
      headers: { 'Access-Control-Allow-Origin': '*' },
    });
  } catch (error) {
    console.error('Ошибка при создании фильма:', error);
    return NextResponse.json({ error: 'Ошибка при создании фильма' }, { status: 500 });
  }
}
