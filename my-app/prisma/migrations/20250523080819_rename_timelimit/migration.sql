/*
  Warnings:

  - You are about to drop the column `timelimit` on the `Session` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Session` DROP COLUMN `timelimit`,
    ADD COLUMN `timeLimit` INTEGER NULL;
