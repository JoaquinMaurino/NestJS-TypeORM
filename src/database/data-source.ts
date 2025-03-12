import { DataSource } from 'typeorm';
import { config } from 'dotenv';

config(); // Cargar variables de entorno

export const AppDataSource = new DataSource({
  type: process.env.DB_TYPE as 'postgres' | 'mysql',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [__dirname + '/../**/*.entity{.ts,.js}'], // Cargar todas las entidades automáticamente
  migrations: ['src/migrations/*.ts'], // Ruta donde estarán las migraciones
  synchronize: false, // Siempre false en producción
  logging: true,
});
