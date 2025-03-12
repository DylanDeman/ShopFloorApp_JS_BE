/*
  Warnings:

  - Added the required column `product_informatie` to the `machines` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `machines` ADD COLUMN `product_informatie` VARCHAR(512) NOT NULL;
