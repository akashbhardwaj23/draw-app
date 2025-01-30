/*
  Warnings:

  - You are about to drop the column `yPostion` on the `ShapeMessage` table. All the data in the column will be lost.
  - Added the required column `yPosition` to the `ShapeMessage` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ShapeMessage" DROP COLUMN "yPostion",
ADD COLUMN     "yPosition" INTEGER NOT NULL;
