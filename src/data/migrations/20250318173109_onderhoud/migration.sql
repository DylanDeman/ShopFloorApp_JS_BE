/*
  Warnings:

  - The primary key for the `onderhouden` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `onderhoud_id` on the `onderhouden` table. All the data in the column will be lost.
  - Added the required column `id` to the `onderhouden` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `onderhouden` DROP PRIMARY KEY,
    DROP COLUMN `onderhoud_id`,
    ADD COLUMN `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id`);
