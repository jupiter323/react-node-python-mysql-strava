module.exports = {
    "up": "CREATE TABLE `product_user` (        `id` int(10) NOT NULL AUTO_INCREMENT,        `product_selection_id` int(10) DEFAULT NULL,        `user_id` int(10) DEFAULT NULL,        `product_id` int(10) DEFAULT NULL,        PRIMARY KEY (`id`)      ) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;",
    "down": "DROP TABLE IF EXISTS `product_user`;"
}