/*
  Warnings:

  - You are about to drop the `_possede` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `_possede` DROP FOREIGN KEY `_possede_A_fkey`;

-- DropForeignKey
ALTER TABLE `_possede` DROP FOREIGN KEY `_possede_B_fkey`;

-- DropTable
DROP TABLE `_possede`;

-- CreateTable
CREATE TABLE `AssetMedia` (
    `assetId` INTEGER NOT NULL,
    `mediaId` INTEGER NOT NULL,

    PRIMARY KEY (`assetId`, `mediaId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `AssetMedia` ADD CONSTRAINT `AssetMedia_assetId_fkey` FOREIGN KEY (`assetId`) REFERENCES `Asset`(`id_asset`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AssetMedia` ADD CONSTRAINT `AssetMedia_mediaId_fkey` FOREIGN KEY (`mediaId`) REFERENCES `Medias`(`id_media`) ON DELETE RESTRICT ON UPDATE CASCADE;
