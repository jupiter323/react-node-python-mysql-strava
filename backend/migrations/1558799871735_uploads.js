module.exports = {
    "up": "CREATE TABLE `uploads` (        `upload_id` int(6) unsigned NOT NULL AUTO_INCREMENT,        `upload_user_id` int(6) unsigned DEFAULT NULL,        `upload_filename` varchar(50) DEFAULT '',        `upload_date` datetime DEFAULT CURRENT_TIMESTAMP,        `upload_status` varchar(50) DEFAULT '',        `upload_user_settings` text,        `upload_system_settings` text,        PRIMARY KEY (`upload_id`)      ) ENGINE=InnoDB AUTO_INCREMENT=4535 DEFAULT CHARSET=latin1;",
    "down": "DROP TABLE IF EXISTS `uploads`;"
}