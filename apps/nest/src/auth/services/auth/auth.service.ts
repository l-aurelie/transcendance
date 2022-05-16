import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../../typeorm';
import { UserDetails } from '../../utils/types';
import { AuthenticationProvider } from './auth';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService implements AuthenticationProvider {
    private code;
    constructor(@InjectRepository(User) private userRepo: Repository<User>, private mailerService: MailerService) {
        this.code = Math.floor(10000 + Math.random() * 90000);
    }
  //  constructor(@InjectRepository(User) private userRepo:
   // Repository<User>) {}
   
   async signin(user: User, jwt: JwtService): Promise<any> {
    try{
       const foundUser = await this.userRepo.findOne({ email: user.email });
       if (foundUser) {
         if (foundUser.isVerified) {
           //if (bcrypt.compare(user.password, foundUser.password)) {
             const payload = { email: user.email };
             return {
               token: jwt.sign(payload),
             };
         //  }
         } else {
           return new HttpException('Please verify your account', HttpStatus.UNAUTHORIZED)
         }
         //return new HttpException('Incorrect username or password', HttpStatus.UNAUTHORIZED)
        }
            return new HttpException('Incorrect username or password', HttpStatus.UNAUTHORIZED)
    } catch(e){
        return new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
    }
    }

  /*  async verifyAccount(code: String): Promise<any> {
        try{
           const user = await this.userRepo.findOne({
             authConfirmToken: code
           });
           if (!user) {
             return new HttpException('Verification code has expired or not found', HttpStatus.UNAUTHORIZED)
           }
           await this.userRepo.update({ authConfirmToken: user.authConfirmToken }, { isVerified: true, authConfirmToken: undefined });
           return true;
        }catch(e){
           return new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
        }
        }
        
        async sendConfirmationEmail(user: any) {
          const { email, fullname } = await user
          await this.mailerService.sendMail({
            to: email,
            subject: 'Welcome to Nice App! Confirm Email',
            template: 'confirm',
            context: {
              fullname,
              code: this.code
            },
          });
        }
*/
    async validateUser(details: UserDetails, newCode: Number) {
        const { intraId } = details;
        const user = await this.userRepo.findOne({ where: { intraId} });

        if (user)
        {
          this.sendCode(user, newCode);
            await this.userRepo.update( {intraId }, details);
            console.log('updated');
            return user;
        }
        const newUser = await this.createUser(details);
        this.sendCode(newUser, newCode);
    }
    createUser(details: UserDetails){
        console.log('creating user');
        const user = this.userRepo.create(details);
        return this.userRepo.save(user);
    };
    findUser(intraId: string){
        return this.userRepo.findOne( { where: { intraId } } );
    };

    async sendCode(user: User, newCode: Number) {
      await this.mailerService.sendMail({
        to: user.email,
        subject: 'Welcome to Nice App! Confirm Email',
        template: 'confirm',
        context: {
          login: user.login,
          code: newCode
        },
      });
    }
}