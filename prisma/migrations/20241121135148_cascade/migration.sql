-- DropForeignKey
ALTER TABLE `Asset` DROP FOREIGN KEY `Asset_categorieId_fkey`;

-- DropForeignKey
ALTER TABLE `AssetMedia` DROP FOREIGN KEY `AssetMedia_assetId_fkey`;

-- DropForeignKey
ALTER TABLE `AssetMedia` DROP FOREIGN KEY `AssetMedia_mediaId_fkey`;

-- AddForeignKey
ALTER TABLE `Asset` ADD CONSTRAINT `Asset_categorieId_fkey` FOREIGN KEY (`categorieId`) REFERENCES `Categorie`(`id_categorie`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AssetMedia` ADD CONSTRAINT `AssetMedia_assetId_fkey` FOREIGN KEY (`assetId`) REFERENCES `Asset`(`id_asset`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AssetMedia` ADD CONSTRAINT `AssetMedia_mediaId_fkey` FOREIGN KEY (`mediaId`) REFERENCES `Medias`(`id_media`) ON DELETE CASCADE ON UPDATE CASCADE;
