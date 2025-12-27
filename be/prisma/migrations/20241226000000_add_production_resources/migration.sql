-- Migration: Add Production Resources (Machines, WorkCenters, etc.)
-- Date: 2024-12-26

-- Add enums for production resources
ALTER TABLE `boms` ADD COLUMN `endDate` DATETIME NULL DEFAULT NULL;

ALTER TABLE `production_order` ADD COLUMN `endDate` DATETIME NULL DEFAULT NULL;

ALTER TABLE `production_orders` ADD COLUMN `endDate` DATETIME NULL DEFAULT NULL;

-- Production Resources Enums
CREATE TYPE ProductionResourceType AS ENUM ('MACHINE', 'WORK_CENTER', 'LINE', 'CELL', 'STATION');
CREATE TYPE MachineStatus AS ENUM ('ACTIVE', 'INACTIVE', 'MAINTENANCE', 'DOWN', 'REPAIR');
CREATE TYPE MaintenanceType AS ENUM ('PREVENTIVE', 'CORRECTIVE', 'PREDICTIVE', 'EMERGENCY');
CREATE TYPE AllocationStatus AS ENUM ('PLANNED', 'SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');

-- Work Centers
CREATE TABLE `work_centers` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `code` VARCHAR(50) NOT NULL,
  `name` VARCHAR(200) NOT NULL,
  `description` TEXT NULL,
  `location` VARCHAR(200) NULL,
  `capacity_per_hour` DECIMAL(18,3) NOT NULL DEFAULT 0,
  `efficiency_factor` DECIMAL(5,2) NOT NULL DEFAULT 100.00,
  `working_hours_start` TIME NULL,
  `working_hours_end` TIME NULL,
  `is_active` BOOLEAN NOT NULL DEFAULT true,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` DATETIME(3) NOT NULL,

  PRIMARY KEY (`id`),
  UNIQUE INDEX `work_centers_code_key`(`code`),
  INDEX `work_centers_is_active_index`(`is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Machines
CREATE TABLE `machines` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `work_center_id` BIGINT NULL,
  `code` VARCHAR(50) NOT NULL,
  `name` VARCHAR(200) NOT NULL,
  `serial_number` VARCHAR(100) NULL,
  `manufacturer` VARCHAR(200) NULL,
  `model` VARCHAR(100) NULL,
  `purchase_date` DATE NULL,
  `warranty_expiry` DATE NULL,
  `status` MachineStatus NOT NULL DEFAULT 'ACTIVE',
  `capacity_per_hour` DECIMAL(18,3) NOT NULL DEFAULT 0,
  `setup_time_minutes` INT NOT NULL DEFAULT 0,
  `cycle_time_minutes` DECIMAL(8,2) NOT NULL DEFAULT 0,
  `oee_target` DECIMAL(5,2) NOT NULL DEFAULT 85.00,
  `location` VARCHAR(200) NULL,
  `note` TEXT NULL,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` DATETIME(3) NOT NULL,

  PRIMARY KEY (`id`),
  UNIQUE INDEX `machines_code_key`(`code`),
  INDEX `machines_work_center_id_index`(`work_center_id`),
  INDEX `machines_status_index`(`status`),
  CONSTRAINT `machines_work_center_id_fkey` FOREIGN KEY (`work_center_id`) REFERENCES `work_centers` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Machine Maintenance
CREATE TABLE `machine_maintenance` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `machine_id` BIGINT NOT NULL,
  `maintenance_type` MaintenanceType NOT NULL,
  `description` TEXT NOT NULL,
  `scheduled_date` DATETIME NOT NULL,
  `scheduled_duration_hours` DECIMAL(8,2) NOT NULL DEFAULT 0,
  `actual_start_time` DATETIME NULL,
  `actual_end_time` DATETIME NULL,
  `actual_duration_hours` DECIMAL(8,2) NULL,
  `cost` DECIMAL(18,2) NULL DEFAULT 0,
  `technician` VARCHAR(200) NULL,
  `status` VARCHAR(50) NOT NULL DEFAULT 'SCHEDULED',
  `notes` TEXT NULL,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` DATETIME(3) NOT NULL,

  PRIMARY KEY (`id`),
  INDEX `machine_maintenance_machine_id_index`(`machine_id`),
  INDEX `machine_maintenance_scheduled_date_index`(`scheduled_date`),
  INDEX `machine_maintenance_status_index`(`status`),
  CONSTRAINT `machine_maintenance_machine_id_fkey` FOREIGN KEY (`machine_id`) REFERENCES `machines` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Resource Capacity Planning
CREATE TABLE `resource_capacity` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `work_center_id` BIGINT NOT NULL,
  `date` DATE NOT NULL,
  `shift` VARCHAR(20) NOT NULL DEFAULT 'DAY',
  `planned_capacity_hours` DECIMAL(8,2) NOT NULL DEFAULT 0,
  `available_capacity_hours` DECIMAL(8,2) NOT NULL DEFAULT 0,
  `actual_capacity_hours` DECIMAL(8,2) NULL DEFAULT 0,
  `downtime_hours` DECIMAL(8,2) NOT NULL DEFAULT 0,
  `efficiency_percent` DECIMAL(5,2) NOT NULL DEFAULT 100.00,
  `oee_percent` DECIMAL(5,2) NULL DEFAULT 0,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` DATETIME(3) NOT NULL,

  PRIMARY KEY (`id`),
  UNIQUE INDEX `resource_capacity_work_center_id_date_shift_key`(`work_center_id`, `date`, `shift`),
  INDEX `resource_capacity_date_index`(`date`),
  CONSTRAINT `resource_capacity_work_center_id_fkey` FOREIGN KEY (`work_center_id`) REFERENCES `work_centers` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Resource Allocations
CREATE TABLE `resource_allocations` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `production_order_id` BIGINT NOT NULL,
  `work_center_id` BIGINT NOT NULL,
  `machine_id` BIGINT NULL,
  `allocation_date` DATE NOT NULL,
  `start_time` TIME NOT NULL,
  `end_time` TIME NOT NULL,
  `planned_hours` DECIMAL(8,2) NOT NULL,
  `actual_hours` DECIMAL(8,2) NULL DEFAULT 0,
  `status` AllocationStatus NOT NULL DEFAULT 'PLANNED',
  `quantity_planned` DECIMAL(18,3) NOT NULL DEFAULT 0,
  `quantity_actual` DECIMAL(18,3) NULL DEFAULT 0,
  `efficiency_percent` DECIMAL(5,2) NULL DEFAULT 0,
  `notes` TEXT NULL,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` DATETIME(3) NOT NULL,

  PRIMARY KEY (`id`),
  INDEX `resource_allocations_production_order_id_index`(`production_order_id`),
  INDEX `resource_allocations_work_center_id_index`(`work_center_id`),
  INDEX `resource_allocations_machine_id_index`(`machine_id`),
  INDEX `resource_allocations_allocation_date_index`(`allocation_date`),
  INDEX `resource_allocations_status_index`(`status`),
  CONSTRAINT `resource_allocations_production_order_id_fkey` FOREIGN KEY (`production_order_id`) REFERENCES `production_orders` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `resource_allocations_work_center_id_fkey` FOREIGN KEY (`work_center_id`) REFERENCES `work_centers` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `resource_allocations_machine_id_fkey` FOREIGN KEY (`machine_id`) REFERENCES `machines` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Production Calendar (Holiday/Working days)
CREATE TABLE `production_calendar` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `date` DATE NOT NULL,
  `day_type` VARCHAR(20) NOT NULL DEFAULT 'WORKING', -- WORKING, HOLIDAY, WEEKEND, SPECIAL
  `description` VARCHAR(200) NULL,
  `is_working_day` BOOLEAN NOT NULL DEFAULT true,
  `working_hours` DECIMAL(4,2) NOT NULL DEFAULT 8.0,
  `shift_1_hours` DECIMAL(4,2) NOT NULL DEFAULT 8.0,
  `shift_2_hours` DECIMAL(4,2) NOT NULL DEFAULT 0.0,
  `shift_3_hours` DECIMAL(4,2) NOT NULL DEFAULT 0.0,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` DATETIME(3) NOT NULL,

  PRIMARY KEY (`id`),
  UNIQUE INDEX `production_calendar_date_key`(`date`),
  INDEX `production_calendar_is_working_day_index`(`is_working_day`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Add relations to existing tables
ALTER TABLE `production_orders` ADD CONSTRAINT `production_orders_endDate_check` CHECK (`endDate` IS NULL OR `endDate` >= `startDate`);
