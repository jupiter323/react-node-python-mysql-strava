module.exports = {
    "up": "CREATE TABLE `activity` (        `id` int(10) NOT NULL AUTO_INCREMENT,        `username` varchar(250) COLLATE utf8_unicode_ci NOT NULL,        `count` int(10) DEFAULT NULL,        PRIMARY KEY (`id`)      ) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;",
    "down": "DROP TABLE IF EXISTS `activity`;"
}