/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Answer` table. All the data in the column will be lost.
  - Added the required column `answeredAt` to the `Answer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Answer` DROP COLUMN `createdAt`,
    ADD COLUMN `answeredAt` DATETIME(3) NOT NULL;
