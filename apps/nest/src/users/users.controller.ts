import { Controller, Get, Post, Delete } from '@nestjs/common';

@Controller('users')
export class UsersController {
    @Get()
    getUser() {
       console.log('log : user successfully get');
       return 'user successfully get';
    }

    @Post()
    addUser() {
       console.log('log : user successfully add');
       return 'user successfully add';
    }

    @Delete()
    deleteUser() {
       console.log('log : user successfully delete');
       return 'user successfully delete';
    }
}