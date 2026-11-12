const { defineConfig, globalIgnores } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  globalIgnores(['dist/*', '.expo/*', 'html.js']),
  expoConfig,
  {
    // Node-only scripts (not part of the app bundle)
    files: ['patch-html.js', 'eslint.config.js'],
    languageOptions: {
      sourceType: 'commonjs',
      globals: { require: 'readonly', module: 'writable', process: 'readonly', __dirname: 'readonly', console: 'readonly' },
    },
  },
]);
