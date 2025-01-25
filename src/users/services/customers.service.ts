import { Injectable, NotFoundException } from '@nestjs/common';
import { generateId } from '../../common/generate-id'
import { Customer } from '../entities/customer.entity';
import { CreateCustomerDto, UpdateCustomerDto } from '../dtos/customer.dto';


@Injectable()
export class CustomersService {

    private customers: Customer[] = []
    
        findAll() {
            return this.customers
        }
    
        findOne(id: number) {
            const customer = this.customers.find((customer) => customer.id === id)
            if (!customer) {
                throw new NotFoundException(`Customer with ID: ${id} not found`)
            }
            return customer
        }
    
        createOne(payload: CreateCustomerDto) {
            const newCustomer = {
                id: generateId(this.customers),
                ...payload
            }
            this.customers.push(newCustomer)
            return (newCustomer)
        }
    
        remove(id: number) {
            const customer = this.findOne(id)
            if (!customer) {
                throw new NotFoundException(`Customer with ID: ${id} not found`)
            }
            this.customers = this.customers.filter((customer) => customer.id !== id)
            return {
                message: 'customer deleted successfully',
                data: customer
            }
        }
    
        updateOne(id: number, payload: UpdateCustomerDto) {
            const index = this.customers.findIndex((customer) => customer.id === id)
            if (index === -1) {
                throw new NotFoundException(`Customer with ID: ${id} not found`)
            }
            this.customers[index] = {
                ...this.customers[index],
                ...payload
            }
            return this.customers[index]
    
        }
}
