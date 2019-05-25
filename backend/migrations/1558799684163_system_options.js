module.exports = {
    "up": "CREATE TABLE `system_options` (        `id` int(11) NOT NULL AUTO_INCREMENT,        `ui_name` varchar(255) DEFAULT NULL,        `text` varchar(255) DEFAULT NULL,        `default_value` text,        PRIMARY KEY (`id`)      ) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;",
    "down": "DROP TABLE IF EXISTS system_options;"
}