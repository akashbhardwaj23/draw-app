/*
  Warnings:

  - Added the required column `roomId` to the `ShapeMessage` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ShapeMessage" ADD COLUMN     "roomId" INTEGER NOT NULL;
