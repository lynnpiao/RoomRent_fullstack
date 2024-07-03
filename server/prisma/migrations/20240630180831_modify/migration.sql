/*
  Warnings:

  - The primary key for the `Like` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `tenantId` on the `Like` table. All the data in the column will be lost.
  - The primary key for the `ManageApartment` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `managerId` on the `ManageApartment` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Manager` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Tenant` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `userId` to the `Like` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `ManageApartment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `role` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Like` DROP FOREIGN KEY `Like_tenantId_fkey`;

-- DropForeignKey
ALTER TABLE `ManageApartment` DROP FOREIGN KEY `ManageApartment_managerId_fkey`;

-- DropForeignKey
ALTER TABLE `Manager` DROP FOREIGN KEY `Manager_userId_fkey`;

-- DropForeignKey
ALTER TABLE `Tenant` DROP FOREIGN KEY `Tenant_userId_fkey`;

-- AlterTable
ALTER TABLE `Like` DROP PRIMARY KEY,
    DROP COLUMN `tenantId`,
    ADD COLUMN `userId` INTEGER NOT NULL,
    ADD PRIMARY KEY (`roomId`, `userId`);

-- AlterTable
ALTER TABLE `ManageApartment` DROP PRIMARY KEY,
    DROP COLUMN `managerId`,
    ADD COLUMN `userId` INTEGER NOT NULL,
    ADD PRIMARY KEY (`userId`, `apartmentId`);

-- AlterTable
ALTER TABLE `User` DROP COLUMN `name`,
    ADD COLUMN `role` VARCHAR(191) NOT NULL;

-- DropTable
DROP TABLE `Manager`;

-- DropTable
DROP TABLE `Tenant`;

-- AddForeignKey
ALTER TABLE `ManageApartment` ADD CONSTRAINT `ManageApartment_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`userId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Like` ADD CONSTRAINT `Like_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`userId`) ON DELETE CASCADE ON UPDATE CASCADE;
