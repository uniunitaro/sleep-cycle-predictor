CREATE TABLE `Config` (
	`id` int AUTO_INCREMENT PRIMARY KEY NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`userId` varchar(255) NOT NULL,
	`predictionSrcDuration` enum('week1','week2','month1','month2','month3','month4','month6','year1') NOT NULL DEFAULT 'month2',
	CONSTRAINT `Config_userId_unique` UNIQUE(`userId`)
);
--> statement-breakpoint
CREATE TABLE `Sleep` (
	`id` int AUTO_INCREMENT PRIMARY KEY NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`userId` varchar(255) NOT NULL,
	`start` datetime NOT NULL,
	`end` datetime NOT NULL,
	`parentSleepId` int
);
--> statement-breakpoint
CREATE TABLE `User` (
	`id` varchar(255) PRIMARY KEY NOT NULL,
	`email` varchar(255),
	`nickname` varchar(255) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `User_email_unique` UNIQUE(`email`)
);
