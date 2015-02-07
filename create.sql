CREATE TABLE `user` (
`id` INT(10) unsigned NOT NULL AUTO_INCREMENT,
`name` VARCHAR(255) NOT NULL,
`external_id` VARCHAR(255) NOT NULL,
`oauth_token` VARCHAR(255) NOT NULL,
`oauth_token_secret` VARCHAR(255) NOT NULL,
`picture` VARCHAR(255) NULL,
`points` INT(10) NULL,
`settings` TEXT NULL,
`created_at` DATETIME NOT NULL,
PRIMARY KEY (`id`),
KEY `external_id` (`external_id`)) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `room` (
`id` INT(10) unsigned NOT NULL AUTO_INCREMENT,
`name` VARCHAR(255) NOT NULL,
`slug` VARCHAR(255) NOT NULL,
`owner_id` INT(10) UNSIGNED NOT NULL,
`settings` TEXT NULL,
`created_at` DATETIME NOT NULL,
PRIMARY KEY (`id`),
KEY `owner` (`owner`)) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `roomRoster` (
`id` INT(10) unsigned NOT NULL AUTO_INCREMENT,
`room_id` INT(10) unsigned NOT NULL,
`user_id` INT(10) unsigned NOT NULL,
`created_at` DATETIME NOT NULL,
PRIMARY KEY (`id`),
KEY `room_id` (`room_id`),
KEY `user_id` (`user_id`)) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `roomQueue` (
`id` INT(10) unsigned NOT NULL AUTO_INCREMENT,
`room_id` INT(10) unsigned NOT NULL,
`song_id` VARCHAR(255) NOT NULL,
`user_id` INT(10) unsigned NOT NULL,
`track` TEXT NOT NULL,
`created_at` DATETIME NOT NULL,
PRIMARY KEY (`id`),
KEY `room_id` (`room_id`),
KEY `song_id` (`song_id`),
KEY `user_id` (`user_id`)) ENGINE=InnoDB DEFAULT CHARSET=utf8;
