import { DataSource, DataSourceOptions } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { config } from 'dotenv';

config();
export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: 'database-1.cchuga462du7.us-east-1.rds.amazonaws.com',
  port: parseInt('5432'),
  username: 'postgres',
  password: 'I8HtR4ADJaL1JUyMXkcc',
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
