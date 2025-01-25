import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ParseIntPipe } from 'src/common/parse-int.pipe';
import { CreateCustomerDto, UpdateCustomerDto } from 'src/dtos/customer.dto';
import { CustomersService } from 'src/services/customers.service';


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
