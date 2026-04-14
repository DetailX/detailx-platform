CREATE TABLE `uploads` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text,
	`project_name` text NOT NULL,
	`file_name` text NOT NULL,
	`file_type` text NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`location` text NOT NULL,
	`notes` text,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
