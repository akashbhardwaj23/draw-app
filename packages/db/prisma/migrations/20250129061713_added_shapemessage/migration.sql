/*
  Warnings:

  - You are about to drop the column `message` on the `Chat` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "ShapeType" AS ENUM ('Rectangle', 'Square', 'Ellipse');

-- AlterTable
ALTER TABLE "Chat" DROP COLUMN "message";

-- CreateTable
CREATE TABLE "ShapeMessage" (
    "id" TEXT NOT NULL,
    "type" "ShapeType" NOT NULL,
    "xPosition" INTEGER NOT NULL,
    "yPostion" INTEGER NOT NULL,
    "width" INTEGER NOT NULL,
    "height" INTEGER NOT NULL,
    "chatId" INTEGER NOT NULL,

    CONSTRAINT "ShapeMessage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ShapeMessage_chatId_key" ON "ShapeMessage"("chatId");

-- AddForeignKey
ALTER TABLE "ShapeMessage" ADD CONSTRAINT "ShapeMessage_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "Chat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
