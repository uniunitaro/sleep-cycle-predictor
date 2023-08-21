DROP INDEX `searchIdx` ON `Sleep`;--> statement-breakpoint
CREATE INDEX `searchIdx` ON `Sleep` (`parentSleepId`,`userId`,`start`,`end`);