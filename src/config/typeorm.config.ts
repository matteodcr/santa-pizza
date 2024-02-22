import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'example-database',
  password: 'example-database-password',
  database: 'pizza',
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: true,
};
