import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import { AuthModule } from './auth/auth.module';
import { PizzaModule } from './pizza/pizza.module';
import { GroupModule } from './group/group.module';
import { MembershipModule } from './membership/membership.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    AuthModule,
    PizzaModule,
    GroupModule,
    MembershipModule,
  ],
})
export class AppModule {}
