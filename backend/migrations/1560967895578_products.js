module.exports = {
    "up": "CREATE TABLE `products` (        `product_id` int(10) NOT NULL AUTO_INCREMENT,        `product_label` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,        `product_img` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,        `cal` int(10) DEFAULT NULL,        `fib` int(10) DEFAULT NULL,        `car` int(10) DEFAULT NULL,        `fat` int(10) DEFAULT NULL,        PRIMARY KEY (`product_id`)      ) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;",
    "down": "DROP TABLE IF EXISTS `products`;"
}