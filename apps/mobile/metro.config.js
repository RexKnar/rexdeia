const { getDefaultConfig } = require('expo/metro-config');
const fs = require('fs');
const path = require('path');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

// 1. Watch all files in the monorepo for live code sharing
config.watchFolders = [workspaceRoot];

// 2. Resolve modules from both local and workspace root node_modules
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
];

// 3. Force Metro to resolve runtime JavaScript for 'react' from local node_modules
// preventing TypeScript declaration paths in tsconfig from hijacking runtime bundling
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === 'react') {
    return {
      filePath: path.resolve(projectRoot, 'node_modules/react/index.js'),
      type: 'sourceFile',
    };
  }
  if (moduleName.startsWith('react/')) {
    const subpath = moduleName.replace(/^react\//, '');
    const candidate = path.resolve(projectRoot, `node_modules/react/${subpath}.js`);
    if (fs.existsSync(candidate)) {
      return {
        filePath: candidate,
        type: 'sourceFile',
      };
    }
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
