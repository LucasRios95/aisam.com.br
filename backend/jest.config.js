module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',

  // Diretórios de teste
  roots: ['<rootDir>/src'],

  // Padrões de arquivos de teste
  testMatch: [
    '**/__tests__/**/*.test.ts',
    '**/__tests__/**/*.spec.ts',
    '**/*.test.ts',
    '**/*.spec.ts'
  ],

  // Transformações
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },

  // Extensões de arquivo
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],

  // Path mapping (mesmo do tsconfig.json)
  moduleNameMapper: {
    '^@modules/(.*)$': '<rootDir>/src/modules/$1',
    '^@config/(.*)$': '<rootDir>/src/config/$1',
    '^@shared/(.*)$': '<rootDir>/src/shared/$1',
    '^@errors/(.*)$': '<rootDir>/src/shared/errors/$1',
    '^@utils/(.*)$': '<rootDir>/src/utils/$1',
    // Paths sem @ (para compatibilidade com código existente)
    '^modules/(.*)$': '<rootDir>/src/modules/$1',
    '^config/(.*)$': '<rootDir>/src/config/$1',
    '^shared/(.*)$': '<rootDir>/src/shared/$1',
    '^utils/(.*)$': '<rootDir>/src/utils/$1',
  },

  // Cobertura de código
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.spec.ts',
    '!src/**/*.test.ts',
    '!src/**/index.ts',
    '!src/shared/infra/http/server.ts',
    '!src/shared/infra/typeorm/migrations/**',
    '!src/shared/infra/typeorm/seed/**',
  ],

  // Diretório de cobertura
  coverageDirectory: 'coverage',

  // Reporters de cobertura
  coverageReporters: ['text', 'lcov', 'html'],

  // Limites de cobertura
  coverageThreshold: {
    global: {
      branches: 50,
      functions: 50,
      lines: 50,
      statements: 50,
    },
  },

  // Limpar mocks entre testes
  clearMocks: true,

  // Timeout de testes
  testTimeout: 10000,

  // Variáveis de ambiente para testes
  setupFiles: ['<rootDir>/src/__tests__/setup.ts'],

  // Ignorar arquivos
  testPathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
    '/coverage/',
  ],

  // Globals do ts-jest
  globals: {
    'ts-jest': {
      isolatedModules: true,
      tsconfig: {
        esModuleInterop: true,
        allowSyntheticDefaultImports: true,
      },
    },
  },
};
