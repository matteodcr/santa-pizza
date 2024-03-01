import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

import { PizzaDto } from './dto/pizza.dto';
import { PublicPizzaDto } from './dto/public-pizza.dto';
import { UpdatePizzaStatusDto } from './dto/update-pizza-status.dto';
import { Pizza } from './pizza.entity';
import { PizzaService } from './pizza.service';
import { GetUser } from '../auth/get-user-decorator';
import { User } from '../user/user.entity';

@ApiTags('pizza')
@Controller('pizza')
@UseGuards(AuthGuard())
@UsePipes(ValidationPipe)
export class PizzaController {
  constructor(private readonly pizzaService: PizzaService) {}

  @Post()
  @ApiResponse({
    status: 201,
    description: 'The pizza has been successfully created.',
    type: Pizza,
  })
  createPizza(
    @Body() createPizzaDto: PizzaDto,
    @GetUser() user: User,
  ): Promise<PublicPizzaDto> {
    return this.pizzaService.createPizza(createPizzaDto, user);
  }

  @Delete(':id')
  @ApiResponse({
    status: 200,
    description: 'The pizza has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Pizza not found.' })
  async deletePizza(
    @Param('id') id: number,
    @GetUser() user: User,
  ): Promise<void> {
    return await this.pizzaService.deletePizza(id, user);
  }

  @Get()
  @ApiResponse({
    status: 200,
    description: 'Returns all pizzas.',
    type: [Pizza],
  })
  async getPizzas(@GetUser() user: User): Promise<PublicPizzaDto[]> {
    const pizzas = await this.pizzaService.getPizzas(user);
    return pizzas.map((pizza) => new PublicPizzaDto(pizza));
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'Returns the pizza with the specified ID.',
    type: Pizza,
  })
  @ApiResponse({ status: 404, description: 'Pizza not found.' })
  async getPizzaById(
    @Param('id') id: number,
    @GetUser() user: User,
  ): Promise<PublicPizzaDto> {
    return new PublicPizzaDto(await this.pizzaService.getPizzaById(id, user));
  }

  @Patch(':id')
  @ApiResponse({
    status: 200,
    description: 'The pizza has been successfully updated.',
    type: Pizza,
  })
  @ApiResponse({ status: 404, description: 'Pizza not found.' })
  async updatePizzaStatus(
    @Param('id') id: number,
    @Body() updatePizzaStatusDto: UpdatePizzaStatusDto,
    @GetUser() user: User,
  ): Promise<PublicPizzaDto> {
    return new PublicPizzaDto(
      await this.pizzaService.updatePizza(id, updatePizzaStatusDto, user),
    );
  }
}
