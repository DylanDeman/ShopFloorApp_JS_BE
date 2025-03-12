/*
  Warnings:

  - Added the required column `product_informatie` to the `machines` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `sites` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `gebruikers` MODIFY `rol` LONGTEXT NOT NULL;

-- AlterTable
ALTER TABLE `machines` ADD COLUMN `product_informatie` VARCHAR(512) NOT NULL,
    MODIFY `status` ENUM('DRAAIT', 'MANUEEL_GESTOPT', 'AUTOMATISCH_GESTOPT', 'IN_ONDERHOUD', 'STARTBAAR') NOT NULL;

-- AlterTable
ALTER TABLE `sites` ADD COLUMN `status` ENUM('ACTIEF', 'INACTIEF') NOT NULL;

-- CreateTable
CREATE TABLE `kpis` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `onderwerp` VARCHAR(191) NOT NULL,
    `roles` JSON NOT NULL,
    `grafiek` ENUM('LINE', 'BAR', 'SINGLE', 'LIST', 'TOP5', 'SITES', 'TOP5OND') NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `kpiwaarden` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `datum` DATETIME(3) NOT NULL,
    `waarde` JSON NOT NULL,
    `site_id` VARCHAR(50) NULL,
    `kpi_id` INTEGER UNSIGNED NOT NULL,

    UNIQUE INDEX `kpiwaarden_kpi_id_datum_site_id_key`(`kpi_id`, `datum`, `site_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `dashboards` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `gebruiker_id` INTEGER UNSIGNED NOT NULL,
    `kpi_id` INTEGER UNSIGNED NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `notificaties` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `tijdstip` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `bericht` VARCHAR(510) NOT NULL,
    `gelezen` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `kpiwaarden` ADD CONSTRAINT `kpiwaarden_kpi_id_fkey` FOREIGN KEY (`kpi_id`) REFERENCES `kpis`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `dashboards` ADD CONSTRAINT `fk_gebruiker_dashboard` FOREIGN KEY (`gebruiker_id`) REFERENCES `gebruikers`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `dashboards` ADD CONSTRAINT `dashboards_kpi_id_fkey` FOREIGN KEY (`kpi_id`) REFERENCES `kpis`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
