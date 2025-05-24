/*
  Warnings:

  - You are about to drop the column `avatar` on the `players` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `players` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `players` table. All the data in the column will be lost.
  - You are about to drop the column `login` on the `players` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `players` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `players` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "players_email_key";

-- DropIndex
DROP INDEX "players_login_key";

-- AlterTable
ALTER TABLE "players" DROP COLUMN "avatar",
DROP COLUMN "createdAt",
DROP COLUMN "email",
DROP COLUMN "login",
DROP COLUMN "role",
DROP COLUMN "updatedAt";
