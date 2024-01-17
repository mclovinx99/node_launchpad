/*
  Warnings:

  - Added the required column `email` to the `Admin` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Students` DROP FOREIGN KEY `Students_teacher_id_fkey`;

-- AlterTable
ALTER TABLE `Admin` ADD COLUMN `email` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Students` ADD COLUMN `verified` BOOLEAN NULL,
    MODIFY `teacher_id` INTEGER NULL;

-- AlterTable
ALTER TABLE `Teacher` ADD COLUMN `verified` BOOLEAN NULL;

-- AddForeignKey
ALTER TABLE `Students` ADD CONSTRAINT `Students_teacher_id_fkey` FOREIGN KEY (`teacher_id`) REFERENCES `Teacher`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
