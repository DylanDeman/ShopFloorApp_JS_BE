/*
  Warnings:

  - Added the required column `status` to the `sites` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `machines` MODIFY `status` ENUM('DRAAIT', 'MANUEEL_GESTOPT', 'AUTOMATISCH_GESTOPT', 'IN_ONDERHOUD', 'STARTBAAR') NOT NULL;

-- AlterTable
ALTER TABLE `sites` ADD COLUMN `status` ENUM('ACTIEF', 'INACTIEF') NOT NULL;

-- CreateTable
CREATE TABLE `kpis` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `onderwerp` VARCHAR(191) NOT NULL,
    `roles` JSON NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `kpiwaarden` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `datum` DATETIME(3) NOT NULL,
    `waarde` JSON NOT NULL,
    `kpi_id` INTEGER UNSIGNED NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `dashboards` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `gebruiker_id` INTEGER UNSIGNED NOT NULL,
    `kpi_id` INTEGER UNSIGNED NOT NULL,

    UNIQUE INDEX `dashboards_gebruiker_id_kpi_id_key`(`gebruiker_id`, `kpi_id`),
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
ALTER TABLE `dashboards` ADD CONSTRAINT `fk_kpi_dashboard` FOREIGN KEY (`kpi_id`) REFERENCES `kpis`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
