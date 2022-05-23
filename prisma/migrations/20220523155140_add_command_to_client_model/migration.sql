/*
  Warnings:

  - The primary key for the `Client` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `command` to the `Client` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Client" DROP CONSTRAINT "Client_pkey",
ADD COLUMN     "command" TEXT NOT NULL,
ADD CONSTRAINT "Client_pkey" PRIMARY KEY ("chatId", "command");
