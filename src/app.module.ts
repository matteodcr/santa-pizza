import { join } from 'path';

import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from './auth/auth.module';
import { typeOrmConfig } from './config/typeorm.config';
import { GroupModule } from './group/group.module';
import { MembershipModule } from './membership/membership.module';
import { PizzaModule } from './pizza/pizza.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    ScheduleModule.forRoot(),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..'),
    }),
    AuthModule,
    PizzaModule,
    GroupModule,
    MembershipModule,
    UserModule,
  ],
})
export class AppModule {}
