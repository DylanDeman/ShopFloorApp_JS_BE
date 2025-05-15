-- CreateTable
CREATE TABLE `addresses` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `street` VARCHAR(255) NOT NULL,
    `number` VARCHAR(50) NOT NULL,
    `city` VARCHAR(100) NOT NULL,
    `postalcode` VARCHAR(10) NOT NULL,
    `land` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `address_id` INTEGER UNSIGNED NOT NULL,
    `lastname` VARCHAR(255) NOT NULL,
    `firstname` VARCHAR(255) NOT NULL,
    `birthdate` DATETIME(0) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `phonenumber` VARCHAR(255) NOT NULL,
    `role` LONGTEXT NOT NULL,
    `status` ENUM('ACTIEF', 'INACTIEF') NOT NULL,

    UNIQUE INDEX `users_email_key`(`email`),
    INDEX `fk_adres_gebruiker`(`address_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `kpis` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `onderwerp` VARCHAR(191) NOT NULL,
    `roles` JSON NOT NULL,
    `grafiek` ENUM('LINE', 'BARHOOGLAAG', 'BARLAAGHOOG', 'SINGLE', 'LIST', 'TOP5', 'SITES', 'TOP5OND', 'AANKOND', 'GEZONDHEID', 'MACHLIST') NOT NULL,

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

    INDEX `dashboards_kpi_id_fkey`(`kpi_id`),
    INDEX `fk_gebruiker_dashboard`(`gebruiker_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sites` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `sitename` VARCHAR(255) NOT NULL,
    `verantwoordelijke_id` INTEGER UNSIGNED NOT NULL,
    `status` ENUM('ACTIEF', 'INACTIEF') NOT NULL,
    `address_id` INTEGER UNSIGNED NULL,

    INDEX `fk_gebruiker_site`(`verantwoordelijke_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `machines` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `code` VARCHAR(255) NOT NULL,
    `location` VARCHAR(255) NOT NULL,
    `machinestatus` ENUM('DRAAIT', 'MANUEEL_GESTOPT', 'AUTOMATISCH_GESTOPT', 'IN_ONDERHOUD', 'STARTBAAR') NOT NULL,
    `lastmaintenance` DATETIME(3) NOT NULL,
    `productionstatus` ENUM('GEZOND', 'NOOD_ONDERHOUD', 'FALEND') NOT NULL,
    `aantal_goede_producten` INTEGER UNSIGNED NOT NULL,
    `aantal_slechte_producten` INTEGER UNSIGNED NOT NULL,
    `limiet_voor_onderhoud` INTEGER UNSIGNED NOT NULL,
    `product_naam` VARCHAR(255) NOT NULL,
    `productinfo` LONGTEXT NOT NULL,
    `technician_id` INTEGER UNSIGNED NOT NULL,
    `site_id` INTEGER UNSIGNED NOT NULL,

    INDEX `fk_gebruiker_machine`(`technician_id`),
    INDEX `fk_site_machine`(`site_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `maintenances` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `machine_id` INTEGER UNSIGNED NOT NULL,
    `technician_id` INTEGER UNSIGNED NOT NULL,
    `executiondate` DATETIME(0) NOT NULL,
    `startdate` DATETIME(0) NOT NULL,
    `enddate` DATETIME(0) NOT NULL,
    `reason` VARCHAR(255) NOT NULL,
    `status` ENUM('VOLTOOID', 'IN_UITVOERING', 'INGEPLAND') NOT NULL,
    `comments` VARCHAR(255) NOT NULL,

    INDEX `fk_gebruiker_onderhoud`(`technician_id`),
    INDEX `fk_machine_onderhoud`(`machine_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `notification` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `time` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `message` VARCHAR(510) NOT NULL,
    `isread` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `fk_adres_gebruiker` FOREIGN KEY (`address_id`) REFERENCES `addresses`(`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `kpiwaarden` ADD CONSTRAINT `kpiwaarden_kpi_id_fkey` FOREIGN KEY (`kpi_id`) REFERENCES `kpis`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `dashboards` ADD CONSTRAINT `dashboards_kpi_id_fkey` FOREIGN KEY (`kpi_id`) REFERENCES `kpis`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `dashboards` ADD CONSTRAINT `fk_gebruiker_dashboard` FOREIGN KEY (`gebruiker_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sites` ADD CONSTRAINT `fk_gebruiker_site` FOREIGN KEY (`verantwoordelijke_id`) REFERENCES `users`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `machines` ADD CONSTRAINT `fk_gebruiker_machine` FOREIGN KEY (`technician_id`) REFERENCES `users`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `machines` ADD CONSTRAINT `fk_site_machine` FOREIGN KEY (`site_id`) REFERENCES `sites`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `maintenances` ADD CONSTRAINT `fk_gebruiker_onderhoud` FOREIGN KEY (`technician_id`) REFERENCES `users`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `maintenances` ADD CONSTRAINT `fk_machine_onderhoud` FOREIGN KEY (`machine_id`) REFERENCES `machines`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
