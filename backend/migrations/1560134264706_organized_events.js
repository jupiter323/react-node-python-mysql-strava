module.exports = {
    "up": "CREATE TABLE `organizedevents` (`id` int(6) NOT NULL AUTO_INCREMENT, `file_name` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;",
    "down": "DROP TABLE IF EXISTS `organizedevents`;"
}