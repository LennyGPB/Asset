-- CreateTable
CREATE TABLE `Buy` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `assetId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Buy_userId_assetId_key`(`userId`, `assetId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Buy` ADD CONSTRAINT `Buy_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Buy` ADD CONSTRAINT `Buy_assetId_fkey` FOREIGN KEY (`assetId`) REFERENCES `Asset`(`id_asset`) ON DELETE CASCADE ON UPDATE CASCADE;
