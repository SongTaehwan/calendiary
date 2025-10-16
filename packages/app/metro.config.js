const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const path = require('path');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const projectRoot = __dirname;
const monorepoRoot = path.resolve(projectRoot, '../..');
const isDevelopment = process.env.NODE_ENV !== 'production';
const defaultConfig = getDefaultConfig(__dirname);

const config = {
  watchFolders: [monorepoRoot],
  resolver: {
    nodeModulesPaths: [
      path.resolve(projectRoot, 'node_modules'),
      path.resolve(monorepoRoot, 'node_modules'),
    ],
    disableHierarchicalLookup: isDevelopment,

    ...(isDevelopment && {
      resolveRequest: (context, moduleName, platform) => {
        if (moduleName === '@calendiary/calendar') {
          console.log(`📦 [Loading] ${moduleName}`);

          const sourcePath = path.resolve(
            monorepoRoot,
            'packages/calendar/src/index.tsx',
          );

          return {
            filePath: sourcePath,
            type: 'sourceFile',
          };
        }

        return context.resolveRequest(context, moduleName, platform);
      },
    }),
    sourceExts: [...defaultConfig.resolver.sourceExts, 'svg'],
  },
};

module.exports = mergeConfig(defaultConfig, config);
