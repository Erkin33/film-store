import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.movie.createMany({
    data: [
      {
        title: "Inception",
        year: 2010,
        genre: "Sci-Fi"
      },
      {
        title: "The Matrix",
        year: 1999,
        genre: "Action"
      },
      {
        title: "Interstellar",
        year: 2014,
        genre: "Sci-Fi"
      }
    ],
    skipDuplicates: true, // Чтобы не дублировать записи, если они уже есть
  });

  console.log("Фильмы успешно добавлены");
}

main()
  .then(() => process.exit(0))
  .catch(e => {
    console.error(e);
    process.exit(1);
  });
