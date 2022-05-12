import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../../typeorm';
import { UserDetails } from '../../utils/types';
import { AuthenticationProvider } from './auth';

@Injectable()
export class AuthService implements AuthenticationProvider {
    /*gets database from typeOrm using @injectRepository*/
    constructor(@InjectRepository(User) private userRepo:
    Repository<User>) {}
    /*userRepo = our user database!*/
    /*validateUser function is responsible for checking if user exists, if exists, it returns user, if not it creates it and returns it*/
    async validateUser(details: UserDetails) {
        const { discordId } = details;
        /*user object contains all user details!*/
        const user = await this.userRepo.findOne({ where: { discordId} });
        if (user)
        {
            await this.userRepo.update( {discordId }, details);
            console.log('updated');
            return user;
        }
        const newUser = await this.createUser(details);
    }
    /*creates new user if not in database*/
    createUser(details: UserDetails){
        console.log('creating user');
        const user = this.userRepo.create(details);
        return this.userRepo.save(user);
    };
    /*returns user if found in database*/
    findUser(discordId: string){
        return this.userRepo.findOne( { where: { discordId } } );
    };
}
