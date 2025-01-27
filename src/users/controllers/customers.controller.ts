import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';


import { ParseIntPipe } from '../../common/parse-int.pipe';
import { CreateCustomerDto, UpdateCustomerDto } from '../dtos/customer.dto';
import { CustomersService } from '../services/customers.service';

@ApiTags('Customers')
@Controller('customers')
export class CustomersController {
    constructor(private customersService: CustomersService) { }

    @Get()
    getCustomers() {
        return this.customersService.findAll()
    }

    @Get('/:id')
    getCustomer(@Param('id', ParseIntPipe) id: number) {
        return this.customersService.findOne(id)
    }

    @Post()
    createCustomer(@Body() payload: CreateCustomerDto) {
        return this.customersService.createOne(payload)
    }

    @Put('/:id')
    updateCustomer(@Param('id', ParseIntPipe) id: number, @Body() payload: UpdateCustomerDto) {
        return this.customersService.updateOne(id, payload)
    }

    @Delete('/:id')
    deleteCustomer(@Param('id', ParseIntPipe) id: number) {
        return this.customersService.remove(id)
    }
}
