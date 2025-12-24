/*
  Warnings:

  - You are about to drop the column `address` on the `warehouse` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `warehouse` table. All the data in the column will be lost.
  - You are about to alter the column `code` on the `warehouse` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(30)`.
  - You are about to alter the column `name` on the `warehouse` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(150)`.
  - You are about to drop the `auditlog` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `customer` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `customercontact` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `customerhandbook` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `customernote` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `entityfile` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `file` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `inbounditem` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `inboundorder` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `inventorybalance` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `marketingcampaign` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `outbounditem` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `outboundorder` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `permission` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `product` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `productionplan` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `productionplanitem` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `quotation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `quotationitem` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `refreshtoken` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `resource` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `role` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `rolepermission` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `salesorder` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `salesorderitem` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `shipment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `shipmentcost` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `shipmentitem` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `shippingpartner` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `shippingplan` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `statushistory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `stockmove` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `userrole` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `vehicle` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `warehousezone` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `workorder` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `workorderresource` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `workorderstep` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `updatedAt` to the `warehouse` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `auditlog` DROP FOREIGN KEY `AuditLog_actorUserId_fkey`;

-- DropForeignKey
ALTER TABLE `customercontact` DROP FOREIGN KEY `CustomerContact_customerId_fkey`;

-- DropForeignKey
ALTER TABLE `customerhandbook` DROP FOREIGN KEY `CustomerHandbook_customerId_fkey`;

-- DropForeignKey
ALTER TABLE `customernote` DROP FOREIGN KEY `CustomerNote_createdById_fkey`;

-- DropForeignKey
ALTER TABLE `customernote` DROP FOREIGN KEY `CustomerNote_customerId_fkey`;

-- DropForeignKey
ALTER TABLE `entityfile` DROP FOREIGN KEY `EntityFile_createdById_fkey`;

-- DropForeignKey
ALTER TABLE `entityfile` DROP FOREIGN KEY `EntityFile_fileId_fkey`;

-- DropForeignKey
ALTER TABLE `file` DROP FOREIGN KEY `File_uploadedById_fkey`;

-- DropForeignKey
ALTER TABLE `inbounditem` DROP FOREIGN KEY `InboundItem_inboundId_fkey`;

-- DropForeignKey
ALTER TABLE `inbounditem` DROP FOREIGN KEY `InboundItem_productId_fkey`;

-- DropForeignKey
ALTER TABLE `inboundorder` DROP FOREIGN KEY `InboundOrder_warehouseId_fkey`;

-- DropForeignKey
ALTER TABLE `inventorybalance` DROP FOREIGN KEY `InventoryBalance_productId_fkey`;

-- DropForeignKey
ALTER TABLE `inventorybalance` DROP FOREIGN KEY `InventoryBalance_warehouseId_fkey`;

-- DropForeignKey
ALTER TABLE `inventorybalance` DROP FOREIGN KEY `InventoryBalance_zoneId_fkey`;

-- DropForeignKey
ALTER TABLE `outbounditem` DROP FOREIGN KEY `OutboundItem_outboundId_fkey`;

-- DropForeignKey
ALTER TABLE `outbounditem` DROP FOREIGN KEY `OutboundItem_productId_fkey`;

-- DropForeignKey
ALTER TABLE `outboundorder` DROP FOREIGN KEY `OutboundOrder_salesOrderId_fkey`;

-- DropForeignKey
ALTER TABLE `outboundorder` DROP FOREIGN KEY `OutboundOrder_warehouseId_fkey`;

-- DropForeignKey
ALTER TABLE `productionplan` DROP FOREIGN KEY `ProductionPlan_createdById_fkey`;

-- DropForeignKey
ALTER TABLE `productionplanitem` DROP FOREIGN KEY `ProductionPlanItem_planId_fkey`;

-- DropForeignKey
ALTER TABLE `productionplanitem` DROP FOREIGN KEY `ProductionPlanItem_productId_fkey`;

-- DropForeignKey
ALTER TABLE `quotation` DROP FOREIGN KEY `Quotation_createdById_fkey`;

-- DropForeignKey
ALTER TABLE `quotation` DROP FOREIGN KEY `Quotation_customerId_fkey`;

-- DropForeignKey
ALTER TABLE `quotationitem` DROP FOREIGN KEY `QuotationItem_productId_fkey`;

-- DropForeignKey
ALTER TABLE `quotationitem` DROP FOREIGN KEY `QuotationItem_quotationId_fkey`;

-- DropForeignKey
ALTER TABLE `refreshtoken` DROP FOREIGN KEY `RefreshToken_userId_fkey`;

-- DropForeignKey
ALTER TABLE `rolepermission` DROP FOREIGN KEY `RolePermission_permissionId_fkey`;

-- DropForeignKey
ALTER TABLE `rolepermission` DROP FOREIGN KEY `RolePermission_roleId_fkey`;

-- DropForeignKey
ALTER TABLE `salesorder` DROP FOREIGN KEY `SalesOrder_createdById_fkey`;

-- DropForeignKey
ALTER TABLE `salesorder` DROP FOREIGN KEY `SalesOrder_customerId_fkey`;

-- DropForeignKey
ALTER TABLE `salesorderitem` DROP FOREIGN KEY `SalesOrderItem_productId_fkey`;

-- DropForeignKey
ALTER TABLE `salesorderitem` DROP FOREIGN KEY `SalesOrderItem_salesOrderId_fkey`;

-- DropForeignKey
ALTER TABLE `shipment` DROP FOREIGN KEY `Shipment_partnerId_fkey`;

-- DropForeignKey
ALTER TABLE `shipment` DROP FOREIGN KEY `Shipment_planId_fkey`;

-- DropForeignKey
ALTER TABLE `shipment` DROP FOREIGN KEY `Shipment_salesOrderId_fkey`;

-- DropForeignKey
ALTER TABLE `shipment` DROP FOREIGN KEY `Shipment_vehicleId_fkey`;

-- DropForeignKey
ALTER TABLE `shipmentcost` DROP FOREIGN KEY `ShipmentCost_shipmentId_fkey`;

-- DropForeignKey
ALTER TABLE `shipmentitem` DROP FOREIGN KEY `ShipmentItem_productId_fkey`;

-- DropForeignKey
ALTER TABLE `shipmentitem` DROP FOREIGN KEY `ShipmentItem_shipmentId_fkey`;

-- DropForeignKey
ALTER TABLE `shippingplan` DROP FOREIGN KEY `ShippingPlan_partnerId_fkey`;

-- DropForeignKey
ALTER TABLE `shippingplan` DROP FOREIGN KEY `ShippingPlan_vehicleId_fkey`;

-- DropForeignKey
ALTER TABLE `statushistory` DROP FOREIGN KEY `StatusHistory_changedById_fkey`;

-- DropForeignKey
ALTER TABLE `stockmove` DROP FOREIGN KEY `StockMove_productId_fkey`;

-- DropForeignKey
ALTER TABLE `stockmove` DROP FOREIGN KEY `StockMove_warehouseId_fkey`;

-- DropForeignKey
ALTER TABLE `stockmove` DROP FOREIGN KEY `StockMove_zoneId_fkey`;

-- DropForeignKey
ALTER TABLE `userrole` DROP FOREIGN KEY `UserRole_roleId_fkey`;

-- DropForeignKey
ALTER TABLE `userrole` DROP FOREIGN KEY `UserRole_userId_fkey`;

-- DropForeignKey
ALTER TABLE `warehousezone` DROP FOREIGN KEY `WarehouseZone_warehouseId_fkey`;

-- DropForeignKey
ALTER TABLE `workorder` DROP FOREIGN KEY `WorkOrder_productId_fkey`;

-- DropForeignKey
ALTER TABLE `workorder` DROP FOREIGN KEY `WorkOrder_salesOrderId_fkey`;

-- DropForeignKey
ALTER TABLE `workorderresource` DROP FOREIGN KEY `WorkOrderResource_resourceId_fkey`;

-- DropForeignKey
ALTER TABLE `workorderresource` DROP FOREIGN KEY `WorkOrderResource_workOrderId_fkey`;

-- DropForeignKey
ALTER TABLE `workorderstep` DROP FOREIGN KEY `WorkOrderStep_workOrderId_fkey`;

-- AlterTable
ALTER TABLE `warehouse` DROP COLUMN `address`,
    DROP COLUMN `status`,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `note` VARCHAR(255) NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL,
    MODIFY `code` VARCHAR(30) NOT NULL,
    MODIFY `name` VARCHAR(150) NOT NULL;

-- DropTable
DROP TABLE `auditlog`;

-- DropTable
DROP TABLE `customer`;

-- DropTable
DROP TABLE `customercontact`;

-- DropTable
DROP TABLE `customerhandbook`;

-- DropTable
DROP TABLE `customernote`;

-- DropTable
DROP TABLE `entityfile`;

-- DropTable
DROP TABLE `file`;

-- DropTable
DROP TABLE `inbounditem`;

-- DropTable
DROP TABLE `inboundorder`;

-- DropTable
DROP TABLE `inventorybalance`;

-- DropTable
DROP TABLE `marketingcampaign`;

-- DropTable
DROP TABLE `outbounditem`;

-- DropTable
DROP TABLE `outboundorder`;

-- DropTable
DROP TABLE `permission`;

-- DropTable
DROP TABLE `product`;

-- DropTable
DROP TABLE `productionplan`;

-- DropTable
DROP TABLE `productionplanitem`;

-- DropTable
DROP TABLE `quotation`;

-- DropTable
DROP TABLE `quotationitem`;

-- DropTable
DROP TABLE `refreshtoken`;

-- DropTable
DROP TABLE `resource`;

-- DropTable
DROP TABLE `role`;

-- DropTable
DROP TABLE `rolepermission`;

-- DropTable
DROP TABLE `salesorder`;

-- DropTable
DROP TABLE `salesorderitem`;

-- DropTable
DROP TABLE `shipment`;

-- DropTable
DROP TABLE `shipmentcost`;

-- DropTable
DROP TABLE `shipmentitem`;

-- DropTable
DROP TABLE `shippingpartner`;

-- DropTable
DROP TABLE `shippingplan`;

-- DropTable
DROP TABLE `statushistory`;

-- DropTable
DROP TABLE `stockmove`;

-- DropTable
DROP TABLE `user`;

-- DropTable
DROP TABLE `userrole`;

-- DropTable
DROP TABLE `vehicle`;

-- DropTable
DROP TABLE `warehousezone`;

-- DropTable
DROP TABLE `workorder`;

-- DropTable
DROP TABLE `workorderresource`;

-- DropTable
DROP TABLE `workorderstep`;

-- CreateTable
CREATE TABLE `users` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(150) NOT NULL,
    `passwordHash` VARCHAR(255) NOT NULL,
    `fullName` VARCHAR(150) NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `lastLoginAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,

    UNIQUE INDEX `users_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `roles` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `code` VARCHAR(50) NOT NULL,
    `name` VARCHAR(150) NOT NULL,
    `description` VARCHAR(255) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `roles_code_key`(`code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `permissions` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `code` VARCHAR(80) NOT NULL,
    `name` VARCHAR(150) NOT NULL,
    `module` VARCHAR(80) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `permissions_code_key`(`code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `role_user` (
    `userId` BIGINT NOT NULL,
    `roleId` BIGINT NOT NULL,

    INDEX `role_user_roleId_idx`(`roleId`),
    PRIMARY KEY (`userId`, `roleId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `role_permission` (
    `roleId` BIGINT NOT NULL,
    `permissionId` BIGINT NOT NULL,

    INDEX `role_permission_permissionId_idx`(`permissionId`),
    PRIMARY KEY (`roleId`, `permissionId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `refresh_tokens` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `userId` BIGINT NOT NULL,
    `tokenHash` VARCHAR(255) NOT NULL,
    `expiresAt` DATETIME(3) NOT NULL,
    `revokedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `userAgent` VARCHAR(255) NULL,
    `ip` VARCHAR(64) NULL,

    UNIQUE INDEX `refresh_tokens_tokenHash_key`(`tokenHash`),
    INDEX `refresh_tokens_userId_idx`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `customers` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `code` VARCHAR(50) NULL,
    `name` VARCHAR(200) NOT NULL,
    `taxCode` VARCHAR(50) NULL,
    `phone` VARCHAR(30) NULL,
    `email` VARCHAR(150) NULL,
    `address` VARCHAR(255) NULL,
    `note` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `customers_code_key`(`code`),
    INDEX `customers_name_idx`(`name`),
    INDEX `customers_phone_idx`(`phone`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `customer_notes` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `customerId` BIGINT NOT NULL,
    `userId` BIGINT NULL,
    `content` TEXT NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `customer_notes_customerId_idx`(`customerId`),
    INDEX `customer_notes_userId_idx`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `product_style` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `code` VARCHAR(50) NULL,
    `name` VARCHAR(200) NOT NULL,
    `note` VARCHAR(255) NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `product_style_code_key`(`code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sizes` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `code` VARCHAR(30) NOT NULL,
    `name` VARCHAR(80) NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `sizes_code_key`(`code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `colors` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `code` VARCHAR(30) NOT NULL,
    `name` VARCHAR(80) NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `colors_code_key`(`code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `product_variant` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `sku` VARCHAR(60) NULL,
    `productStyleId` BIGINT NOT NULL,
    `sizeId` BIGINT NOT NULL,
    `colorId` BIGINT NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `product_variant_sku_key`(`sku`),
    INDEX `product_variant_productStyleId_idx`(`productStyleId`),
    INDEX `product_variant_sizeId_idx`(`sizeId`),
    INDEX `product_variant_colorId_idx`(`colorId`),
    UNIQUE INDEX `product_variant_productStyleId_sizeId_colorId_key`(`productStyleId`, `sizeId`, `colorId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sale_orders` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `orderNo` VARCHAR(50) NOT NULL,
    `customerId` BIGINT NOT NULL,
    `createdById` BIGINT NULL,
    `orderDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `dueDate` DATETIME(3) NULL,
    `status` ENUM('DRAFT', 'CONFIRMED', 'IN_PRODUCTION', 'DONE', 'CANCELLED') NOT NULL DEFAULT 'DRAFT',
    `note` TEXT NULL,
    `isInternal` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `sale_orders_orderNo_key`(`orderNo`),
    INDEX `sale_orders_customerId_idx`(`customerId`),
    INDEX `sale_orders_createdById_idx`(`createdById`),
    INDEX `sale_orders_status_orderDate_idx`(`status`, `orderDate`),
    INDEX `sale_orders_customerId_orderDate_idx`(`customerId`, `orderDate`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sale_orders_item` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `salesOrderId` BIGINT NOT NULL,
    `lineNo` INTEGER NOT NULL,
    `productStyleId` BIGINT NOT NULL,
    `itemName` VARCHAR(200) NOT NULL,
    `uom` VARCHAR(20) NOT NULL DEFAULT 'pcs',
    `qtyTotal` DECIMAL(18, 3) NOT NULL,
    `unitPrice` DECIMAL(18, 2) NOT NULL,
    `amount` DECIMAL(18, 2) NOT NULL,
    `note` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `sale_orders_item_productStyleId_idx`(`productStyleId`),
    INDEX `sale_orders_item_salesOrderId_idx`(`salesOrderId`),
    UNIQUE INDEX `sale_orders_item_salesOrderId_lineNo_key`(`salesOrderId`, `lineNo`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `so_item_variant_breakdowns` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `salesOrderItemId` BIGINT NOT NULL,
    `productVariantId` BIGINT NOT NULL,
    `qty` DECIMAL(18, 3) NOT NULL,

    INDEX `so_item_variant_breakdowns_productVariantId_idx`(`productVariantId`),
    UNIQUE INDEX `so_item_variant_breakdowns_salesOrderItemId_productVariantId_key`(`salesOrderItemId`, `productVariantId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `production_order` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `moNo` VARCHAR(50) NOT NULL,
    `salesOrderItemId` BIGINT NULL,
    `productStyleId` BIGINT NOT NULL,
    `createdById` BIGINT NULL,
    `qtyPlan` DECIMAL(18, 3) NOT NULL,
    `qtyDone` DECIMAL(18, 3) NOT NULL DEFAULT 0,
    `startDate` DATETIME(3) NULL,
    `dueDate` DATETIME(3) NULL,
    `status` ENUM('DRAFT', 'RELEASED', 'RUNNING', 'DONE', 'CANCELLED') NOT NULL DEFAULT 'DRAFT',
    `note` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `production_order_moNo_key`(`moNo`),
    INDEX `production_order_salesOrderItemId_idx`(`salesOrderItemId`),
    INDEX `production_order_productStyleId_idx`(`productStyleId`),
    INDEX `production_order_createdById_idx`(`createdById`),
    INDEX `production_order_status_idx`(`status`),
    INDEX `production_order_status_dueDate_idx`(`status`, `dueDate`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `production_order_breakdowns` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `productionOrderId` BIGINT NOT NULL,
    `productVariantId` BIGINT NOT NULL,
    `qtyPlan` DECIMAL(18, 3) NOT NULL,
    `qtyDone` DECIMAL(18, 3) NOT NULL DEFAULT 0,

    INDEX `production_order_breakdowns_productVariantId_idx`(`productVariantId`),
    UNIQUE INDEX `production_order_breakdowns_productionOrderId_productVariant_key`(`productionOrderId`, `productVariantId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `mo_material_requirement` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `productionOrderId` BIGINT NOT NULL,
    `itemId` BIGINT NOT NULL,
    `uom` VARCHAR(20) NOT NULL DEFAULT 'pcs',
    `qtyRequired` DECIMAL(18, 3) NOT NULL,
    `qtyIssued` DECIMAL(18, 3) NOT NULL DEFAULT 0,
    `wastagePercent` DECIMAL(8, 2) NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `mo_material_requirement_itemId_idx`(`itemId`),
    UNIQUE INDEX `mo_material_requirement_productionOrderId_itemId_key`(`productionOrderId`, `itemId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `items` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `sku` VARCHAR(60) NULL,
    `name` VARCHAR(200) NOT NULL,
    `itemType` ENUM('FABRIC', 'ACCESSORY', 'PACKING', 'OTHER') NOT NULL,
    `baseUom` VARCHAR(20) NOT NULL DEFAULT 'pcs',
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `note` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `items_sku_key`(`sku`),
    INDEX `items_itemType_idx`(`itemType`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `boms` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `code` VARCHAR(50) NULL,
    `productStyleId` BIGINT NOT NULL,
    `name` VARCHAR(200) NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `boms_code_key`(`code`),
    INDEX `boms_productStyleId_idx`(`productStyleId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `bom_lines` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `bomId` BIGINT NOT NULL,
    `itemId` BIGINT NOT NULL,
    `uom` VARCHAR(20) NOT NULL DEFAULT 'pcs',
    `qtyPerUnit` DECIMAL(18, 6) NOT NULL,
    `wastagePercent` DECIMAL(8, 2) NOT NULL DEFAULT 0,

    INDEX `bom_lines_itemId_idx`(`itemId`),
    UNIQUE INDEX `bom_lines_bomId_itemId_key`(`bomId`, `itemId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `supplier` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `code` VARCHAR(50) NULL,
    `name` VARCHAR(200) NOT NULL,
    `taxCode` VARCHAR(50) NULL,
    `phone` VARCHAR(30) NULL,
    `email` VARCHAR(150) NULL,
    `address` VARCHAR(255) NULL,
    `note` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `supplier_code_key`(`code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `purchase_order` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `poNo` VARCHAR(50) NOT NULL,
    `supplierId` BIGINT NOT NULL,
    `createdById` BIGINT NULL,
    `orderDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `status` ENUM('DRAFT', 'CONFIRMED', 'RECEIVING', 'RECEIVED', 'CANCELLED') NOT NULL DEFAULT 'DRAFT',
    `note` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `purchase_order_poNo_key`(`poNo`),
    INDEX `purchase_order_supplierId_idx`(`supplierId`),
    INDEX `purchase_order_createdById_idx`(`createdById`),
    INDEX `purchase_order_status_orderDate_idx`(`status`, `orderDate`),
    INDEX `purchase_order_supplierId_orderDate_idx`(`supplierId`, `orderDate`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `purchase_order_line` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `purchaseOrderId` BIGINT NOT NULL,
    `lineNo` INTEGER NOT NULL,
    `itemId` BIGINT NOT NULL,
    `uom` VARCHAR(20) NOT NULL DEFAULT 'pcs',
    `qty` DECIMAL(18, 3) NOT NULL,
    `unitPrice` DECIMAL(18, 2) NOT NULL,
    `amount` DECIMAL(18, 2) NOT NULL,
    `receivedQty` DECIMAL(18, 3) NOT NULL DEFAULT 0,

    INDEX `purchase_order_line_itemId_idx`(`itemId`),
    INDEX `purchase_order_line_purchaseOrderId_idx`(`purchaseOrderId`),
    UNIQUE INDEX `purchase_order_line_purchaseOrderId_lineNo_key`(`purchaseOrderId`, `lineNo`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `location` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `warehouseId` BIGINT NOT NULL,
    `code` VARCHAR(50) NOT NULL,
    `name` VARCHAR(150) NOT NULL,
    `parentId` BIGINT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `location_parentId_idx`(`parentId`),
    INDEX `location_warehouseId_parentId_idx`(`warehouseId`, `parentId`),
    UNIQUE INDEX `location_warehouseId_code_key`(`warehouseId`, `code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `stock_moves` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `moveNo` VARCHAR(50) NOT NULL,
    `moveType` ENUM('RECEIPT', 'ISSUE', 'OUT', 'ADJUST', 'TRANSFER') NOT NULL,
    `status` ENUM('DRAFT', 'POSTED', 'CANCELLED') NOT NULL DEFAULT 'DRAFT',
    `warehouseId` BIGINT NOT NULL,
    `createdById` BIGINT NULL,
    `moveDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `note` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `purchaseOrderId` BIGINT NULL,
    `productionOrderId` BIGINT NULL,
    `salesOrderId` BIGINT NULL,

    UNIQUE INDEX `stock_moves_moveNo_key`(`moveNo`),
    INDEX `stock_moves_warehouseId_idx`(`warehouseId`),
    INDEX `stock_moves_createdById_idx`(`createdById`),
    INDEX `stock_moves_purchaseOrderId_idx`(`purchaseOrderId`),
    INDEX `stock_moves_productionOrderId_idx`(`productionOrderId`),
    INDEX `stock_moves_salesOrderId_idx`(`salesOrderId`),
    INDEX `stock_moves_warehouseId_moveDate_idx`(`warehouseId`, `moveDate`),
    INDEX `stock_moves_status_moveDate_idx`(`status`, `moveDate`),
    INDEX `stock_moves_moveType_moveDate_idx`(`moveType`, `moveDate`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `stock_moves_line` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `stockMoveId` BIGINT NOT NULL,
    `itemId` BIGINT NULL,
    `productVariantId` BIGINT NULL,
    `uom` VARCHAR(20) NOT NULL DEFAULT 'pcs',
    `qty` DECIMAL(18, 3) NOT NULL,
    `unitCost` DECIMAL(18, 4) NULL,
    `fromLocationId` BIGINT NULL,
    `toLocationId` BIGINT NULL,
    `note` TEXT NULL,

    INDEX `stock_moves_line_stockMoveId_idx`(`stockMoveId`),
    INDEX `stock_moves_line_itemId_idx`(`itemId`),
    INDEX `stock_moves_line_productVariantId_idx`(`productVariantId`),
    INDEX `stock_moves_line_fromLocationId_idx`(`fromLocationId`),
    INDEX `stock_moves_line_toLocationId_idx`(`toLocationId`),
    INDEX `stock_moves_line_stockMoveId_itemId_idx`(`stockMoveId`, `itemId`),
    INDEX `stock_moves_line_stockMoveId_productVariantId_idx`(`stockMoveId`, `productVariantId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `role_user` ADD CONSTRAINT `role_user_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `role_user` ADD CONSTRAINT `role_user_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `roles`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `role_permission` ADD CONSTRAINT `role_permission_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `roles`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `role_permission` ADD CONSTRAINT `role_permission_permissionId_fkey` FOREIGN KEY (`permissionId`) REFERENCES `permissions`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `refresh_tokens` ADD CONSTRAINT `refresh_tokens_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `customer_notes` ADD CONSTRAINT `customer_notes_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `customers`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `customer_notes` ADD CONSTRAINT `customer_notes_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `product_variant` ADD CONSTRAINT `product_variant_productStyleId_fkey` FOREIGN KEY (`productStyleId`) REFERENCES `product_style`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `product_variant` ADD CONSTRAINT `product_variant_sizeId_fkey` FOREIGN KEY (`sizeId`) REFERENCES `sizes`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `product_variant` ADD CONSTRAINT `product_variant_colorId_fkey` FOREIGN KEY (`colorId`) REFERENCES `colors`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sale_orders` ADD CONSTRAINT `sale_orders_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `customers`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sale_orders` ADD CONSTRAINT `sale_orders_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sale_orders_item` ADD CONSTRAINT `sale_orders_item_salesOrderId_fkey` FOREIGN KEY (`salesOrderId`) REFERENCES `sale_orders`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sale_orders_item` ADD CONSTRAINT `sale_orders_item_productStyleId_fkey` FOREIGN KEY (`productStyleId`) REFERENCES `product_style`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `so_item_variant_breakdowns` ADD CONSTRAINT `so_item_variant_breakdowns_salesOrderItemId_fkey` FOREIGN KEY (`salesOrderItemId`) REFERENCES `sale_orders_item`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `so_item_variant_breakdowns` ADD CONSTRAINT `so_item_variant_breakdowns_productVariantId_fkey` FOREIGN KEY (`productVariantId`) REFERENCES `product_variant`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `production_order` ADD CONSTRAINT `production_order_salesOrderItemId_fkey` FOREIGN KEY (`salesOrderItemId`) REFERENCES `sale_orders_item`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `production_order` ADD CONSTRAINT `production_order_productStyleId_fkey` FOREIGN KEY (`productStyleId`) REFERENCES `product_style`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `production_order` ADD CONSTRAINT `production_order_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `production_order_breakdowns` ADD CONSTRAINT `production_order_breakdowns_productionOrderId_fkey` FOREIGN KEY (`productionOrderId`) REFERENCES `production_order`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `production_order_breakdowns` ADD CONSTRAINT `production_order_breakdowns_productVariantId_fkey` FOREIGN KEY (`productVariantId`) REFERENCES `product_variant`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `mo_material_requirement` ADD CONSTRAINT `mo_material_requirement_productionOrderId_fkey` FOREIGN KEY (`productionOrderId`) REFERENCES `production_order`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `mo_material_requirement` ADD CONSTRAINT `mo_material_requirement_itemId_fkey` FOREIGN KEY (`itemId`) REFERENCES `items`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `boms` ADD CONSTRAINT `boms_productStyleId_fkey` FOREIGN KEY (`productStyleId`) REFERENCES `product_style`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `bom_lines` ADD CONSTRAINT `bom_lines_bomId_fkey` FOREIGN KEY (`bomId`) REFERENCES `boms`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `bom_lines` ADD CONSTRAINT `bom_lines_itemId_fkey` FOREIGN KEY (`itemId`) REFERENCES `items`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `purchase_order` ADD CONSTRAINT `purchase_order_supplierId_fkey` FOREIGN KEY (`supplierId`) REFERENCES `supplier`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `purchase_order` ADD CONSTRAINT `purchase_order_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `purchase_order_line` ADD CONSTRAINT `purchase_order_line_purchaseOrderId_fkey` FOREIGN KEY (`purchaseOrderId`) REFERENCES `purchase_order`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `purchase_order_line` ADD CONSTRAINT `purchase_order_line_itemId_fkey` FOREIGN KEY (`itemId`) REFERENCES `items`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `location` ADD CONSTRAINT `location_warehouseId_fkey` FOREIGN KEY (`warehouseId`) REFERENCES `warehouse`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `location` ADD CONSTRAINT `location_parentId_fkey` FOREIGN KEY (`parentId`) REFERENCES `location`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `stock_moves` ADD CONSTRAINT `stock_moves_warehouseId_fkey` FOREIGN KEY (`warehouseId`) REFERENCES `warehouse`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `stock_moves` ADD CONSTRAINT `stock_moves_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `stock_moves` ADD CONSTRAINT `stock_moves_purchaseOrderId_fkey` FOREIGN KEY (`purchaseOrderId`) REFERENCES `purchase_order`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `stock_moves` ADD CONSTRAINT `stock_moves_productionOrderId_fkey` FOREIGN KEY (`productionOrderId`) REFERENCES `production_order`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `stock_moves` ADD CONSTRAINT `stock_moves_salesOrderId_fkey` FOREIGN KEY (`salesOrderId`) REFERENCES `sale_orders`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `stock_moves_line` ADD CONSTRAINT `stock_moves_line_stockMoveId_fkey` FOREIGN KEY (`stockMoveId`) REFERENCES `stock_moves`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `stock_moves_line` ADD CONSTRAINT `stock_moves_line_itemId_fkey` FOREIGN KEY (`itemId`) REFERENCES `items`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `stock_moves_line` ADD CONSTRAINT `stock_moves_line_productVariantId_fkey` FOREIGN KEY (`productVariantId`) REFERENCES `product_variant`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `stock_moves_line` ADD CONSTRAINT `stock_moves_line_fromLocationId_fkey` FOREIGN KEY (`fromLocationId`) REFERENCES `location`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `stock_moves_line` ADD CONSTRAINT `stock_moves_line_toLocationId_fkey` FOREIGN KEY (`toLocationId`) REFERENCES `location`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- RenameIndex
ALTER TABLE `warehouse` RENAME INDEX `Warehouse_code_key` TO `warehouse_code_key`;
