-- Migration: Enhanced BOM System với Multi-level BOM và Versioning
-- Created: 2024-12-01
-- Description: Add BOM versioning, multi-level support, approval workflow, templates

-- Note: Enums are defined in Prisma schema, no need to add to database enums table

-- Enhance bom_lines table với multi-level support
ALTER TABLE `bom_lines` 
ADD COLUMN `lineNo` INT NOT NULL DEFAULT 0,
ADD COLUMN `note` TEXT,
ADD COLUMN `isOptional` BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN `leadTimeDays` INT DEFAULT 0,
ADD COLUMN `subBomId` BIGINT,
ADD COLUMN `parentLineId` BIGINT;

-- Add indexes for enhanced bom_lines
CREATE INDEX `idx_bom_lines_subBomId` ON `bom_lines`(`subBomId`);
CREATE INDEX `idx_bom_lines_parentLineId` ON `bom_lines`(`parentLineId`);

-- Create bom_versions table
CREATE TABLE `bom_versions` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `bomId` BIGINT NOT NULL,
  `versionNo` VARCHAR(20) NOT NULL,
  `status` ENUM('DRAFT', 'PENDING_APPROVAL', 'APPROVED', 'REJECTED', 'ARCHIVED') NOT NULL DEFAULT 'DRAFT',
  `description` TEXT,
  `effectiveFrom` DATETIME(3),
  `effectiveTo` DATETIME(3),
  `parentVersionId` BIGINT,
  `isCurrent` BOOLEAN NOT NULL DEFAULT false,
  `approvedById` BIGINT,
  `approvedAt` DATETIME(3),
  `createdById` BIGINT,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `bom_versions_bomId_versionNo_key` (`bomId`, `versionNo`),
  KEY `idx_bom_versions_bomId_isCurrent` (`bomId`, `isCurrent`),
  KEY `idx_bom_versions_parentVersionId` (`parentVersionId`),
  CONSTRAINT `bom_versions_bomId_fkey` FOREIGN KEY (`bomId`) REFERENCES `boms` (`id`) ON DELETE CASCADE,
  CONSTRAINT `bom_versions_parentVersionId_fkey` FOREIGN KEY (`parentVersionId`) REFERENCES `bom_versions` (`id`) ON DELETE SET NULL,
  CONSTRAINT `bom_versions_approvedById_fkey` FOREIGN KEY (`approvedById`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `bom_versions_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create bom_approvals table  
CREATE TABLE `bom_approvals` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `bomVersionId` BIGINT NOT NULL,
  `approverId` BIGINT NOT NULL,
  `status` ENUM('PENDING', 'APPROVED', 'REJECTED') NOT NULL DEFAULT 'PENDING',
  `comments` TEXT,
  `approvedAt` DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3),
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `bom_approvals_bomVersionId_approverId_key` (`bomVersionId`, `approverId`),
  KEY `idx_bom_approvals_bomVersionId` (`bomVersionId`),
  CONSTRAINT `bom_approvals_bomVersionId_fkey` FOREIGN KEY (`bomVersionId`) REFERENCES `bom_versions` (`id`) ON DELETE CASCADE,
  CONSTRAINT `bom_approvals_approverId_fkey` FOREIGN KEY (`approverId`) REFERENCES `users` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create bom_templates table
CREATE TABLE `bom_templates` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(200) NOT NULL,
  `code` VARCHAR(50),
  `description` TEXT,
  `category` VARCHAR(100),
  `isActive` BOOLEAN NOT NULL DEFAULT true,
  `templateData` JSON NOT NULL,
  `usageCount` BIGINT NOT NULL DEFAULT 0,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `bom_templates_code_key` (`code`),
  KEY `idx_bom_templates_category` (`category`),
  KEY `idx_bom_templates_isActive` (`isActive`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Enhance mo_material_requirement table với cost và lead time
ALTER TABLE `mo_material_requirement` 
ADD COLUMN `unitCost` DECIMAL(18,4),
ADD COLUMN `totalCost` DECIMAL(18,2),
ADD COLUMN `leadTimeDays` INT DEFAULT 0,
ADD COLUMN `requiredDate` DATETIME(3),
ADD COLUMN `bomVersionId` BIGINT;

-- Add indexes for enhanced mo_material_requirement
CREATE INDEX `idx_mo_material_requirement_bomVersionId` ON `mo_material_requirement`(`bomVersionId`);
CREATE INDEX `idx_mo_material_requirement_requiredDate` ON `mo_material_requirement`(`requiredDate`);

-- Add foreign key constraint for enhanced mo_material_requirement
ALTER TABLE `mo_material_requirement` 
ADD CONSTRAINT `mo_material_requirement_bomVersionId_fkey` 
FOREIGN KEY (`bomVersionId`) REFERENCES `bom_versions` (`id`) ON DELETE SET NULL;

-- Add foreign key constraints for bom_lines relationships with explicit relation names
ALTER TABLE `bom_lines` 
ADD CONSTRAINT `bom_lines_subBomId_fkey` 
FOREIGN KEY (`subBomId`) REFERENCES `boms` (`id`) ON DELETE RESTRICT;

ALTER TABLE `bom_lines` 
ADD CONSTRAINT `bom_lines_parentLineId_fkey` 
FOREIGN KEY (`parentLineId`) REFERENCES `bom_lines` (`id`) ON DELETE SET NULL;

-- Add foreign key constraint for BomAsSubBom relation (Bom -> BomLine)
ALTER TABLE `bom_lines` 
ADD CONSTRAINT `bom_lines_bomAsSubBom_fkey` 
FOREIGN KEY (`bomId`) REFERENCES `boms` (`id`) ON DELETE CASCADE;

-- Create migration history
INSERT INTO `_migrations` (revision, name, started_at, finished_at) 
VALUES (999, 'enhanced_bom_system', NOW(), NOW()) 
ON DUPLICATE KEY UPDATE 
name = VALUES(name), finished_at = NOW();

-- Create indexes for better performance
CREATE INDEX `idx_bom_versions_status` ON `bom_versions`(`status`);
CREATE INDEX `idx_bom_approvals_status` ON `bom_approvals`(`status`);
CREATE INDEX `idx_mo_material_requirement_unitCost` ON `mo_material_requirement`(`unitCost`);
CREATE INDEX `idx_mo_material_requirement_totalCost` ON `mo_material_requirement`(`totalCost`);

-- Comments for documentation
ALTER TABLE `bom_versions` COMMENT = 'BOM Versioning System - Track BOM changes over time';
ALTER TABLE `bom_approvals` COMMENT = 'BOM Approval Workflow - Multi-approver support';
ALTER TABLE `bom_templates` COMMENT = 'BOM Templates - Quick BOM creation from common patterns';
ALTER TABLE `bom_lines` COMMENT = 'Enhanced BOM Lines - Multi-level BOM support with hierarchy';
ALTER TABLE `mo_material_requirement` COMMENT = 'Enhanced Material Requirements - Cost calculation and lead time tracking';
