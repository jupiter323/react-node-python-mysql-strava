module.exports = {
    "up": "ALTER TABLE `user` ALTER verified SET DEFAULT 0;",
    "down": "ALTER TABLE `user` ALTER verified DROP DEFAULT; "   
}