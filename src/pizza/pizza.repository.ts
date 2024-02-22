import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Pizza } from './pizza.entity';

@Injectable()
export class PizzaRepository extends Repository<Pizza> {
  constructor(private dataSource: DataSource) {
    super(Pizza, dataSource.createEntityManager());
  }
}
