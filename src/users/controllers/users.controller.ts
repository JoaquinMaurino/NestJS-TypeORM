import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ParseIntPipe } from '../../common/parse-int.pipe';
import { CreateUserDto, UpdateUserDto } from '../dtos/user.dto';
import { UsersService } from '../services/users.service';


@Controller('users')
export class UsersController {
    constructor(private userService: UsersService) { }
    @Get()
    getUsers() {
        return this.userService.findAll()
    }
    @Get('/:id')
    getUser(@Param('id', ParseIntPipe) id: number) {
        return this.userService.findOne(id)
    }
    @Post()
    createUser(@Body() payload: CreateUserDto) {
        return this.userService.createOne(payload)
    }
    @Put('/:id')
    updateUser(@Param('id', ParseIntPipe) id: number, @Body() payload: UpdateUserDto) {
        return this.userService.updateOne(id, payload)
    }
    @Delete('/:id')
    deleteUser(@Param('id', ParseIntPipe) id: number) {
        return this.userService.remove(id)
    }
}
