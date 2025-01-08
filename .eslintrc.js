module.exports = {
  'env': {
    'browser': true,
    'es2021': true,
    'node': true,
    'jest': true
  },
  'extends': [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript'
  ],
  'parser': '@typescript-eslint/parser',
  'parserOptions': {
    'ecmaVersion': 12,
    'sourceType': 'module'
  },
  'plugins': [
    '@typescript-eslint',
    'import',
    'unused-imports',
    '@stylistic'
  ],
  'rules': {
    // Code Quality and Best Practices
    'no-unused-vars': 'off', // Turned off to use @typescript-eslint version
    '@typescript-eslint/no-unused-vars': ['warn', { 'argsIgnorePattern': '^_', 'varsIgnorePattern': '^_' }],
    'eqeqeq': 'error',
    'no-console': 'warn',
    'no-debugger': 'error',
    'no-var': 'error',
    'prefer-const': 'error',
    'no-redeclare': 'error',
    'no-multiple-empty-lines': ['error', { 'max': 1 }],
    'padded-blocks': [
      'error',
      { 'blocks': 'never', 'classes': 'never', 'switches': 'never' }
    ],
    '@typescript-eslint/explicit-function-return-type': [
      'error',
      {
        'allowExpressions': false,       // Enforce return types for all functions, even inline ones
        'allowTypedFunctionExpressions': true, // Allow explicitly typed function expressions
        'allowHigherOrderFunctions': true, // Allow higher-order functions without return type
        'allowDirectConstAssertionInArrowFunctions': true // Allow `const` assertions in arrow functions
      }
    ],
    '@stylistic/type-annotation-spacing': [ 
      "error",
       { 
        "before": false, "after": true
       }
      ],
    // Code Consistency and Style
    'semi': ['error', 'always'],
    'quotes': ['error', 'single'],
    'indent': ['error', 2],
    'comma-dangle': ['error', 'never'],
    'brace-style': ['error', '1tbs'],
    'curly': ['error', 'all'],

    // Error Prevention
    'no-undef': 'error',
    'no-unreachable': 'error',
    'no-empty': ['error', { 'allowEmptyCatch': true }],
    'valid-typeof': 'error',

    // ES6+ Rules
    'arrow-spacing': ['error', { 'before': true, 'after': true }],
    'no-duplicate-imports': 'error',
    'prefer-arrow-callback': 'error',
    'no-new-symbol': 'error',
    'template-curly-spacing': ['error', 'never'],

    // TypeScript-Specific
    '@typescript-eslint/explicit-module-boundary-types': 'warn',
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-inferrable-types': 'warn',

    // Import and Module Management
    'import/no-unresolved': 'warn',
    'import/order': [
      'warn',
      {
        'groups': ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
        'newlines-between': 'always'
      }
    ],
    'import/newline-after-import': ['error', { 'count': 1 }],

    // Unused Imports
    'unused-imports/no-unused-imports': 'error'
  },
  settings: {
    'import/resolver': {
      "node": {
        "extensions": [".js", ".jsx", ".ts", ".tsx"],
        "moduleDirectory": ["src", "node_modules"]
      }
    },
  },
};
