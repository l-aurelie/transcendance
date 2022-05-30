/*samanth*/

import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "src/typeorm";

@Injectable()
export class UsersService {
    constructor (@InjectRepository(User) private userRepo: Repository<User>) {}
    findUserById(idnum: number){ //getter pour trouver user par id
        return this.userRepo.findOne( { id:  idnum  } );
    };

    findUserByJwt(myjwt: string){ //getter pour trouver user par access_token(jwt)
        return this.userRepo.findOne( { jwt:  myjwt  } );
    };
}