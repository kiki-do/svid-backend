/*
  Warnings:

  - You are about to drop the column `name` on the `Admin` table. All the data in the column will be lost.
  - You are about to drop the `Player` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Match" DROP CONSTRAINT "Match_playerId_fkey";

-- DropForeignKey
ALTER TABLE "Player" DROP CONSTRAINT "Player_statisticsId_fkey";

-- AlterTable
ALTER TABLE "Admin" DROP COLUMN "name";

-- DropTable
DROP TABLE "Player";

-- CreateTable
CREATE TABLE "players" (
    "id" SERIAL NOT NULL,
    "login" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "nickname" TEXT NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "socials" TEXT[],
    "statisticsId" INTEGER,

    CONSTRAINT "players_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "players_login_key" ON "players"("login");

-- CreateIndex
CREATE UNIQUE INDEX "players_nickname_key" ON "players"("nickname");

-- AddForeignKey
ALTER TABLE "players" ADD CONSTRAINT "players_statisticsId_fkey" FOREIGN KEY ("statisticsId") REFERENCES "Statistics"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "players"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
