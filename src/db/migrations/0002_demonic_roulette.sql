ALTER TABLE `Config` MODIFY COLUMN `userId` binary(16);--> statement-breakpoint
ALTER TABLE `Sleep` MODIFY COLUMN `userId` binary(16) NOT NULL;--> statement-breakpoint
ALTER TABLE `User` MODIFY COLUMN `id` binary(16) NOT NULL;