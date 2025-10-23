// Setup global para testes
import 'reflect-metadata';

process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret-key';
process.env.DB_HOST = 'localhost';
process.env.DB_PORT = '5432';
process.env.DB_USER = 'test_user';
process.env.DB_PASS = 'test_pass';
process.env.DB_NAME = 'test_database';
process.env.FRONTEND_URL = 'http://localhost:3000';
