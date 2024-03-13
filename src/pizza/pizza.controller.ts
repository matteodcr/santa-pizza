import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { PublicPizzaDto } from './dto/public-pizza.dto';
import { UpdatePizzaStatusDto } from './dto/update-pizza-status.dto';
import { PizzaService } from './pizza.service';
import { GetUser } from '../auth/get-user-decorator';
import { User } from '../user/user.entity';

@ApiTags('pizza')
@ApiBearerAuth()
@Controller('pizza')
@UseGuards(AuthGuard())
@UsePipes(ValidationPipe)
export class PizzaController {
  constructor(private readonly pizzaService: PizzaService) {}

  @ApiOperation({
    summary: 'Get all pizzas',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns all pizzas.',
    type: PublicPizzaDto,
    isArray: true,
  })
  @Get()
  async getPizzas(@GetUser() user: User): Promise<PublicPizzaDto[]> {
    const pizzas = await this.pizzaService.getPizzas(user);
    return pizzas.map((pizza) => new PublicPizzaDto(pizza));
  }

  @ApiOperation({
    summary: 'Get a pizza by its ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns the pizza with the specified ID.',
    type: PublicPizzaDto,
  })
  @ApiResponse({ status: 404, description: 'Pizza not found.' })
  @Get(':id')
  async getPizzaById(
    @Param('id') id: number,
    @GetUser() user: User,
  ): Promise<PublicPizzaDto> {
    return new PublicPizzaDto(await this.pizzaService.getPizzaById(id, user));
  }

  @ApiOperation({
    summary: 'Updates a pizza status',
  })
  @ApiResponse({
    status: 200,
    description: 'The pizza has been successfully updated.',
    type: PublicPizzaDto,
  })
  @ApiResponse({ status: 404, description: 'Pizza not found.' })
  @Patch(':id')
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
