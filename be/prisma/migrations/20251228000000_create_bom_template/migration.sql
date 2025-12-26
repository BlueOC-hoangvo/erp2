-- CreateBomTemplate
CREATE TABLE IF NOT EXISTS `bom_templates` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(200) NOT NULL,
  `code` VARCHAR(50) UNIQUE NULL,
  `description` TEXT NULL,
  `category` VARCHAR(100) NULL,
  `isActive` BOOLEAN NOT NULL DEFAULT TRUE,
  `templateData` JSON NOT NULL,
  `usageCount` BIGINT NOT NULL DEFAULT 0,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- CreateIndex
CREATE INDEX `bom_templates_category_idx` ON `bom_templates` (`category`);
CREATE INDEX `bom_templates_isActive_idx` ON `bom_templates` (`isActive`);

-- AddUpdatedAt trigger if not exists
DELIMITER ;;
CREATE TRIGGER `bom_templates_updatedAt` BEFORE UPDATE ON `bom_templates` FOR EACH ROW BEGIN
  SET NEW.updatedAt = CURRENT_TIMESTAMP(3);
END;;
DELIMITER ;
