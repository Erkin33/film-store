-- AlterTable
ALTER TABLE "Movie" ADD COLUMN     "coverUrl" TEXT,
ADD COLUMN     "description" TEXT,
ALTER COLUMN "year" DROP NOT NULL,
ALTER COLUMN "genre" DROP NOT NULL;
