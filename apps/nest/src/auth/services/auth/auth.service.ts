import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../../typeorm';
import { UserDetails } from '../../utils/types';
import { AuthenticationProvider } from './auth';



@Injectable()
export class AuthService implements AuthenticationProvider {
    constructor(@InjectRepository(User) private userRepo:
    Repository<User>) {}
z
    async validateUser(details: UserDetails) {
        const { intraId } = details;
        const user = await this.userRepo.findOne({ where: { intraId} });
        if (user)
        {
            await this.userRepo.update( {intraId }, details);
            console.log('updated');
            return user;
        }
        const newUser = await this.createUser(details);
    }
    createUser(details: UserDetails){
        console.log('creating user');
        const user = this.userRepo.create(details);
        return this.userRepo.save(user);
    };
    findUser(intraId: string){
        return this.userRepo.findOne( { where: { intraId } } );
    };
}
