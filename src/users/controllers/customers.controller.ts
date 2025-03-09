import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

import { ParseIntPipe } from '../../common/parse-int.pipe';
import { CreateCustomerDto, UpdateCustomerDto } from '../dtos/customer.dto';
import { CustomersService } from '../services/customers.service';
import { FilterOptionsDto } from '../../common/filter-options.dto';

@ApiTags('Customers')
@Controller('customers')
export class CustomersController {
  constructor(private customersService: CustomersService) {}

  @Get()
  getCustomers(@Query() params: FilterOptionsDto) {
    return this.customersService.findAll(params);
  }

  @Get('/:id')
  getCustomer(@Param('id', ParseIntPipe) id: number) {
    return this.customersService.findOne(id);
  }

  @Post()
  createCustomer(@Body() data: CreateCustomerDto) {
    return this.customersService.createOne(data);
  }

  @Put('/:id')
  updateCustomer(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateCustomerDto,
  ) {
    return this.customersService.updateOne(id, data);
  }

  @Delete('/:id')
  deleteCustomer(@Param('id', ParseIntPipe) id: number) {
    return this.customersService.deleteOne(id);
  }
}
