/*
  Warnings:

  - You are about to drop the column `shippingStatus` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Order` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Order" DROP COLUMN "shippingStatus",
DROP COLUMN "status";
