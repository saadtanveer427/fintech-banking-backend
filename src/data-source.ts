import { DataSource, DataSourceOptions } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { config } from 'dotenv';

config();
export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT),
  username: 'postgres',
  password: 'postgres',
  database: 'bankdb',
  entities: ['dist/**/*.entity.{ts,js}'],
  synchronize: true,
  migrations: ['dist/migrations/*.{ts,js}'],
  extra: {
    ssl: false,
  },
  namingStrategy: new SnakeNamingStrategy(),
  logging: false,
};

const dataSource = new DataSource(dataSourceOptions);

export default dataSource;
