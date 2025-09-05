// /** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
// module.exports = {
//   preset: 'ts-jest',
//   testEnvironment: 'node',
//   moduleFileExtensions: ['ts', 'js'],
//   transform: {
//     "\\.[jt]sx?$": "ts-jest",
//   },
//   globals: {
//     'ts-jest': {
//       tsconfig: './tsconfig.json',
//       useESM: true,
//     },
//   },
//   transformIgnorePatterns: [
//     'node_modules/(?!graphql-request)',
//   ],
//   extensionsToTreatAsEsm: ['.ts'],
// };

// import type { Config } from "@jest/types"

// const config: Config.InitialOptions = {
//   preset: "ts-jest/presets/js-with-ts-esm",
//   testEnvironment: "node",
//   extensionsToTreatAsEsm: [".ts"],
//   moduleNameMapper: {
//     "^(\\.{1,2}/.*)\\.js$": "$1",
//   },
//   transform: {
//     "^.+\\.tsx?$": [
//       "ts-jest",
//       {
//         useESM: true,
//       },
//     ],
//   },
//   transformIgnorePatterns: [
//     // Transform ES modules in node_modules
//     "node_modules/(?!(graphql-request|@graphql-typed-document-node|extract-files|formdata-node|web-streams-polyfill|cross-fetch)/)",
//   ],
// }

// export default config

import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|webp|svg)$': 'identity-obj-proxy',
    '\\.(ts)$': '<rootDir>/.jest/identity-obj-proxy-esm.js',
  },
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        useESM: true,
      },
    ],
  },
  transformIgnorePatterns: [
    // Transform ES modules in node_modules
    // "node_modules/(?!(graphql-request|@graphql-typed-document-node|extract-files|formdata-node|web-streams-polyfill|cross-fetch)/)",
  ],
};

export default config;

