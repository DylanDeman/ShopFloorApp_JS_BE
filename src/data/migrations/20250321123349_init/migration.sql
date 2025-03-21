-- CreateTable
CREATE TABLE `adressen` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `straat` VARCHAR(255) NOT NULL,
    `huisnummer` VARCHAR(50) NOT NULL,
    `stadsnaam` VARCHAR(100) NOT NULL,
    `postcode` VARCHAR(10) NOT NULL,
    `land` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `gebruikers` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `adres_id` INTEGER UNSIGNED NOT NULL,
    `naam` VARCHAR(255) NOT NULL,
    `voornaam` VARCHAR(255) NOT NULL,
    `geboortedatum` DATETIME(0) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `wachtwoord` VARCHAR(255) NOT NULL,
    `gsm` VARCHAR(255) NOT NULL,
    `rol` LONGTEXT NOT NULL,
    `status` ENUM('ACTIEF', 'INACTIEF') NOT NULL,

    UNIQUE INDEX `gebruikers_email_key`(`email`),
    INDEX `fk_adres_gebruiker`(`adres_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

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

    INDEX `dashboards_kpi_id_fkey`(`kpi_id`),
    INDEX `fk_gebruiker_dashboard`(`gebruiker_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sites` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `naam` VARCHAR(255) NOT NULL,
    `verantwoordelijke_id` INTEGER UNSIGNED NOT NULL,
    `status` ENUM('ACTIEF', 'INACTIEF') NOT NULL,

    INDEX `fk_gebruiker_site`(`verantwoordelijke_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `producten` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `naam` VARCHAR(255) NOT NULL,
    `product_informatie` LONGTEXT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `machines` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `status_sinds` DATETIME(3) NOT NULL,
    `site_id` INTEGER UNSIGNED NOT NULL,
    `product_id` INTEGER UNSIGNED NOT NULL,
    `technieker_id` INTEGER UNSIGNED NOT NULL,
    `code` VARCHAR(255) NOT NULL,
    `locatie` VARCHAR(255) NOT NULL,
    `status` ENUM('DRAAIT', 'MANUEEL_GESTOPT', 'AUTOMATISCH_GESTOPT', 'IN_ONDERHOUD', 'STARTBAAR') NOT NULL,
    `productie_status` ENUM('GEZOND', 'NOOD_ONDERHOUD', 'FALEND') NOT NULL,
    `aantal_goede_producten` INTEGER UNSIGNED NOT NULL,
    `aantal_slechte_producten` INTEGER UNSIGNED NOT NULL,
    `limiet_voor_onderhoud` INTEGER UNSIGNED NOT NULL,

    INDEX `fk_gebruiker_machine`(`technieker_id`),
    INDEX `fk_product_machine`(`product_id`),
    INDEX `fk_site_machine`(`site_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `onderhouden` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `machine_id` INTEGER UNSIGNED NOT NULL,
    `technieker_id` INTEGER UNSIGNED NOT NULL,
    `datum` DATETIME(0) NOT NULL,
    `starttijdstip` DATETIME(0) NOT NULL,
    `eindtijdstip` DATETIME(0) NOT NULL,
    `reden` VARCHAR(255) NOT NULL,
    `status` ENUM('VOLTOOID', 'IN_UITVOERING', 'INGEPLAND') NOT NULL,
    `opmerkingen` VARCHAR(255) NOT NULL,

    INDEX `fk_gebruiker_onderhoud`(`technieker_id`),
    INDEX `fk_machine_onderhoud`(`machine_id`),
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
ALTER TABLE `gebruikers` ADD CONSTRAINT `fk_adres_gebruiker` FOREIGN KEY (`adres_id`) REFERENCES `adressen`(`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `kpiwaarden` ADD CONSTRAINT `kpiwaarden_kpi_id_fkey` FOREIGN KEY (`kpi_id`) REFERENCES `kpis`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `dashboards` ADD CONSTRAINT `dashboards_kpi_id_fkey` FOREIGN KEY (`kpi_id`) REFERENCES `kpis`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `dashboards` ADD CONSTRAINT `fk_gebruiker_dashboard` FOREIGN KEY (`gebruiker_id`) REFERENCES `gebruikers`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sites` ADD CONSTRAINT `fk_gebruiker_site` FOREIGN KEY (`verantwoordelijke_id`) REFERENCES `gebruikers`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `machines` ADD CONSTRAINT `fk_gebruiker_machine` FOREIGN KEY (`technieker_id`) REFERENCES `gebruikers`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `machines` ADD CONSTRAINT `fk_product_machine` FOREIGN KEY (`product_id`) REFERENCES `producten`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `machines` ADD CONSTRAINT `fk_site_machine` FOREIGN KEY (`site_id`) REFERENCES `sites`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `onderhouden` ADD CONSTRAINT `fk_gebruiker_onderhoud` FOREIGN KEY (`technieker_id`) REFERENCES `gebruikers`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `onderhouden` ADD CONSTRAINT `fk_machine_onderhoud` FOREIGN KEY (`machine_id`) REFERENCES `machines`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
