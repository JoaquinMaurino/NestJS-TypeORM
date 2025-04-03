import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ParseIntPipe } from '../../common/parse-int.pipe';
import { CreateUserDto, UpdateUserDto } from '../dtos/user.dto';
import { UsersService } from '../services/users.service';

import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { FilterOptionsDto } from '../../common/filter-options.dto';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getUsers(
    @Query() params: FilterOptionsDto
  ) {
    return await this.userService.findAll(params);
  }
  @Get('/:id')
  async getUser(@Param('id', ParseIntPipe) id: number) {
    return await this.userService.findOne(id);
  }
  @Get('/:id')
  async getUserByEmail(@Param('id', ParseIntPipe) id: number) {
    return await this.userService.findOne(id);
  }
  @Post()
  async createUser(@Body() payload: CreateUserDto) {
    return await this.userService.createOne(payload);
  }
  @Put('/:id')
  async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateUserDto,
  ) {
    return await this.userService.updateOne(id, data);
  }
  @Delete('/:id')
  async deleteUser(@Param('id', ParseIntPipe) id: number) {
    return await this.userService.deleteOne(id);
  }
/*   @Get('/:id/orders')
  async getOrders(@Param('id', ParseIntPipe) id: number) {
    return await this.userService.getUserOrders(id);
  } */
}
