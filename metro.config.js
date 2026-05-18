const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// 添加assets目录的支持
config.watchFolders = [__dirname];

module.exports = config;
