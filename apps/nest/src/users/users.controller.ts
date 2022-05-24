import { Controller, Delete, Get, Post } from "@nestjs/common";

@Controller('user')
export class UsersController{
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