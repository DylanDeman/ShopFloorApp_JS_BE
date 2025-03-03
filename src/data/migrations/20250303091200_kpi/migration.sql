-- CreateTable
CREATE TABLE `kpis` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `onderwerp` VARCHAR(191) NOT NULL,

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
CREATE TABLE `_GebruikerKPI` (
    `A` INTEGER UNSIGNED NOT NULL,
    `B` INTEGER UNSIGNED NOT NULL,

    UNIQUE INDEX `_GebruikerKPI_AB_unique`(`A`, `B`),
    INDEX `_GebruikerKPI_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `kpiwaarden` ADD CONSTRAINT `kpiwaarden_kpi_id_fkey` FOREIGN KEY (`kpi_id`) REFERENCES `kpis`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_GebruikerKPI` ADD CONSTRAINT `_GebruikerKPI_A_fkey` FOREIGN KEY (`A`) REFERENCES `gebruikers`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_GebruikerKPI` ADD CONSTRAINT `_GebruikerKPI_B_fkey` FOREIGN KEY (`B`) REFERENCES `kpis`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
