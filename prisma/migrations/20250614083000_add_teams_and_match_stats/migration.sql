/*
  Warnings:

  - You are about to drop the column `assists` on the `Match` table. All the data in the column will be lost.
  - You are about to drop the column `deaths` on the `Match` table. All the data in the column will be lost.
  - You are about to drop the column `kills` on the `Match` table. All the data in the column will be lost.
  - You are about to drop the column `mvp` on the `Match` table. All the data in the column will be lost.
  - You are about to drop the column `place` on the `Match` table. All the data in the column will be lost.
  - You are about to drop the column `playerId` on the `Match` table. All the data in the column will be lost.
  - You are about to drop the column `win` on the `Match` table. All the data in the column will be lost.
  - You are about to drop the column `date` on the `Tournament` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `Tournament` table. All the data in the column will be lost.
  - You are about to drop the `MatchStatistics` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Statistics` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TournamentStatistics` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `players` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `format` to the `Tournament` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Match" DROP CONSTRAINT "Match_playerId_fkey";

-- DropForeignKey
ALTER TABLE "MatchStatistics" DROP CONSTRAINT "MatchStatistics_matchId_fkey";

-- DropForeignKey
ALTER TABLE "PlayerOnTeam" DROP CONSTRAINT "PlayerOnTeam_playerId_fkey";

-- DropForeignKey
ALTER TABLE "TournamentStatistics" DROP CONSTRAINT "TournamentStatistics_tournamentId_fkey";

-- DropForeignKey
ALTER TABLE "players" DROP CONSTRAINT "players_statisticsId_fkey";

-- AlterTable
ALTER TABLE "Match" DROP COLUMN "assists",
DROP COLUMN "deaths",
DROP COLUMN "kills",
DROP COLUMN "mvp",
DROP COLUMN "place",
DROP COLUMN "playerId",
DROP COLUMN "win";

-- AlterTable
ALTER TABLE "Tournament" DROP COLUMN "date",
DROP COLUMN "image",
ADD COLUMN     "format" TEXT NOT NULL;

-- DropTable
DROP TABLE "MatchStatistics";

-- DropTable
DROP TABLE "Statistics";

-- DropTable
DROP TABLE "TournamentStatistics";

-- DropTable
DROP TABLE "players";

-- CreateTable
CREATE TABLE "Player" (
    "id" TEXT NOT NULL,
    "nickname" TEXT NOT NULL,

    CONSTRAINT "Player_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlayerMatchStatistics" (
    "id" TEXT NOT NULL,
    "matchId" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "kills" INTEGER NOT NULL,
    "deaths" INTEGER NOT NULL,
    "assists" INTEGER NOT NULL,
    "mvp" INTEGER NOT NULL,
    "score" INTEGER NOT NULL,

    CONSTRAINT "PlayerMatchStatistics_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PlayerOnTeam" ADD CONSTRAINT "PlayerOnTeam_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayerMatchStatistics" ADD CONSTRAINT "PlayerMatchStatistics_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Match"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayerMatchStatistics" ADD CONSTRAINT "PlayerMatchStatistics_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayerMatchStatistics" ADD CONSTRAINT "PlayerMatchStatistics_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
