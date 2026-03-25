module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./'],
          alias: {
            '@': './src',
            '@components': './src/components',
            '@hooks': './src/hooks',
            '@services': './src/services',
            '@stores': './src/stores',
            '@utils': './src/utils',
            '@types': './src/types',
            '@constants': './src/constants',
            '@theme': './src/theme',
            '@hooks': './src/hooks',
          },
        },
      ],
      // react-native-reanimated/plugin — adicionar quando usar EAS Build (não Expo Go)
    ],
  };
};
