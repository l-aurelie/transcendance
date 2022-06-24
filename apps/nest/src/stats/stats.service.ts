import { Injectable } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "src/typeorm";
import { Games } from "src/typeorm/entities/Games";

@Injectable()
export class StatsService {
    constructor(
    @InjectRepository(Games)
    private readonly gamesRepository: Repository<Games>) {}

    async getWins(the_user: User) : Promise<number> {

        const list = await this.gamesRepository.find(
        {
        where: [
            { winner: the_user.id },
        ],
    }
        );
        return list.length;
    }
    
    async getLosses(the_user: User) : Promise<number> {
    
        const list = await this.gamesRepository.find(
        {
        where: [
            { looser: the_user.id },
        ],
    }
        );
        return list.length;
    }
    
    async getMatchHistory(the_user: User) : Promise<Games[]> {
        /*{ relations: ["playerRight", "playerLeft"],*/
        const list = await this.gamesRepository.find(
        {
        where: [
            { looser: the_user.id },
            { winner: the_user.id },
        ],
    }
        );
        console.log("********************************MATHC HISTORY:", list);
        return list;
    }
}
