const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Allow Metro to resolve .js extensions explicitly
// This fixes @react-navigation package module resolution
config.resolver.sourceExts = [
  ...config.resolver.sourceExts,
  'cjs',
];

config.resolver.unstable_enablePackageExports = false;

module.exports = config;
