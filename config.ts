import { registerAs } from '@nestjs/config';

export default registerAs('config', () => {
  return {
    database: {
      name: process.env.DATABASE,
      port: process.env.DATABASE_PORT,
    },
    postgres: {
      dbName: process.env.POSTGRES_DB,
      port: parseInt(process.env.POSTGRES_PORT || '5432', 10),
      password: process.env.POSTGRES_PASSWORD,
      user: process.env.POSTGRES_USER,
      host: process.env.POSTGRES_HOST,
    },
    mysql: {
      dbName: process.env.MY_SQL_DATABASE,
      port: parseInt(process.env.MY_SQL_DATABASE || '3306', 10),
      password: process.env.MY_SQL_ROOT_PASSWORD,
      user: process.env.MY_SQL_USER,
      host: process.env.MY_SQL_HOST,
    },
    apiKey: process.env.API_KEY,
    jwtSecret: process.env.JWT_SECRET,
  };
});
