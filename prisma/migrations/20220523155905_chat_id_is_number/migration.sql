/*
  Warnings:

  - The primary key for the `Client` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Changed the type of `chatId` on the `Client` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Client" DROP CONSTRAINT "Client_pkey",
DROP COLUMN "chatId",
ADD COLUMN     "chatId" INTEGER NOT NULL,
ADD CONSTRAINT "Client_pkey" PRIMARY KEY ("chatId", "command");
