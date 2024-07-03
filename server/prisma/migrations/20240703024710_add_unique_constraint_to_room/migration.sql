/*
  Warnings:

  - A unique constraint covering the columns `[aptNumber,apartmentId]` on the table `Room` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Room_aptNumber_apartmentId_key` ON `Room`(`aptNumber`, `apartmentId`);
