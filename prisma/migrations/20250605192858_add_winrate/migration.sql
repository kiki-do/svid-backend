/*
  Warnings:

  - Added the required column `winrate` to the `Statistics` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Statistics" ADD COLUMN     "winrate" INTEGER NOT NULL;
