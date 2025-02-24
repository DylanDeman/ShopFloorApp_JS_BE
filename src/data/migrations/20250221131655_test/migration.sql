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
    `rol` JSON NOT NULL,
    `status` ENUM('ACTIEF', 'INACTIEF') NOT NULL,

    UNIQUE INDEX `gebruikers_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sites` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `naam` VARCHAR(255) NOT NULL,
    `verantwoordelijke_id` INTEGER UNSIGNED NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `producten` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `naam` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `machines` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `site_id` INTEGER UNSIGNED NOT NULL,
    `product_id` INTEGER UNSIGNED NOT NULL,
    `technieker_gebruiker_id` INTEGER UNSIGNED NOT NULL,
    `code` VARCHAR(255) NOT NULL,
    `locatie` VARCHAR(255) NOT NULL,
    `status` ENUM('DRAAIT', 'MANUEEL_GESTOPT', 'AUTOMATISCH_GESTOPT') NOT NULL,
    `productie_status` ENUM('GEZOND', 'NOOD_ONDERHOUD', 'FALEND') NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `onderhouden` (
    `onderhoud_id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `machine_id` INTEGER UNSIGNED NOT NULL,
    `technieker_gebruiker_id` INTEGER UNSIGNED NOT NULL,
    `datum` DATETIME(0) NOT NULL,
    `starttijdstip` DATETIME(0) NOT NULL,
    `eindtijdstip` DATETIME(0) NOT NULL,
    `reden` VARCHAR(255) NOT NULL,
    `status` ENUM('VOLTOOID', 'IN_UITVOERING', 'INGEPLAND') NOT NULL,
    `opmerkingen` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`onderhoud_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `gebruikers` ADD CONSTRAINT `fk_adres_gebruiker` FOREIGN KEY (`adres_id`) REFERENCES `adressen`(`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sites` ADD CONSTRAINT `fk_gebruiker_site` FOREIGN KEY (`verantwoordelijke_id`) REFERENCES `gebruikers`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `machines` ADD CONSTRAINT `fk_site_machine` FOREIGN KEY (`site_id`) REFERENCES `sites`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `machines` ADD CONSTRAINT `fk_product_machine` FOREIGN KEY (`product_id`) REFERENCES `producten`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `machines` ADD CONSTRAINT `fk_gebruiker_machine` FOREIGN KEY (`technieker_gebruiker_id`) REFERENCES `gebruikers`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `onderhouden` ADD CONSTRAINT `fk_machine_onderhoud` FOREIGN KEY (`machine_id`) REFERENCES `machines`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `onderhouden` ADD CONSTRAINT `fk_gebruiker_onderhoud` FOREIGN KEY (`technieker_gebruiker_id`) REFERENCES `gebruikers`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
