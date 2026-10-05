const path = require('path');
const { createJiti } = require('jiti');

const jiti = createJiti(__filename, {
  alias: {
    '@': path.resolve(__dirname, '../src')
  }
});

// Import and run the tests
jiti('./run-tests.ts');
