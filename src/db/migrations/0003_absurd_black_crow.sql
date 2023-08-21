DROP INDEX `startIdx` ON `Sleep`;--> statement-breakpoint
DROP INDEX `endIdx` ON `Sleep`;--> statement-breakpoint
CREATE INDEX `searchIdx` ON `Sleep` (`userId`,`parentSleepId`,`start`,`end`);