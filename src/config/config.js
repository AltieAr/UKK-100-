import dotenv from 'dotenv';
dotenv.config();

export default {
  development: {
    dialect: process.env.DB_DIALECT || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'PARKIR',
    username: process.env.DB_USER || 'your_username',
    password: process.env.DB_PASS || 'your_password'
  },
  test: {
    dialect: 'postgres',
    host: 'localhost',
    port: 5432,
    database: 'PARKIR',
    username: 'your_username',
    password: 'your_password'
  },
  production: {
    dialect: process.env.DB_DIALECT || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'PARKIR',
    username: process.env.DB_USER || 'your_username',
    password: process.env.DB_PASS || 'your_password'
  }
};
