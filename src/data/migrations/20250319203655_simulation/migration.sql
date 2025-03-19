/*
  Warnings:

  - You are about to drop the column `product_informatie` on the `machines` table. All the data in the column will be lost.
  - You are about to drop the column `technieker_gebruiker_id` on the `machines` table. All the data in the column will be lost.
  - The values [MANUEEL_GESTOPT] on the enum `machines_status` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `naam` on the `producten` table. All the data in the column will be lost.
  - Added the required column `aantal_goede_producten` to the `machines` table without a default value. This is not possible if the table is not empty.
  - Added the required column `aantal_slechte_producten` to the `machines` table without a default value. This is not possible if the table is not empty.
  - Added the required column `limit_voor_onderhoud` to the `machines` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status_sinds` to the `machines` table without a default value. This is not possible if the table is not empty.
  - Added the required column `technieker_id` to the `machines` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productie_informatie` to the `producten` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `machines` DROP FOREIGN KEY `fk_gebruiker_machine`;

-- DropIndex
DROP INDEX `fk_gebruiker_machine` ON `machines`;

-- AlterTable
ALTER TABLE `machines` DROP COLUMN `product_informatie`,
    DROP COLUMN `technieker_gebruiker_id`,
    ADD COLUMN `aantal_goede_producten` INTEGER UNSIGNED NOT NULL,
    ADD COLUMN `aantal_slechte_producten` INTEGER UNSIGNED NOT NULL,
    ADD COLUMN `limit_voor_onderhoud` INTEGER UNSIGNED NOT NULL,
    ADD COLUMN `status_sinds` DATETIME(3) NOT NULL,
    ADD COLUMN `technieker_id` INTEGER UNSIGNED NOT NULL,
    MODIFY `status` ENUM('DRAAIT', 'MANUEEL_GESTOPTf', 'AUTOMATISCH_GESTOPT', 'IN_ONDERHOUD', 'STARTBAAR') NOT NULL;

-- AlterTable
ALTER TABLE `producten` DROP COLUMN `naam`,
    ADD COLUMN `productie_informatie` VARCHAR(255) NOT NULL;

-- CreateIndex
CREATE INDEX `fk_gebruiker_machine` ON `machines`(`technieker_id`);

-- AddForeignKey
ALTER TABLE `machines` ADD CONSTRAINT `fk_gebruiker_machine` FOREIGN KEY (`technieker_id`) REFERENCES `gebruikers`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
