import { Injectable } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "src/typeorm";
import { Games } from "src/typeorm/entities/Games";


@Injectable()
export class StatsService {
    constructor(
    @InjectRepository(Games)
    private readonly gamesRepository: Repository<Games>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>) {}

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
        const list = await this.gamesRepository.find(
        {
        /*pour exporter aussi les utilisateurs, sinon ca marche pas*/
        relations: ["userLeft", "userRight"],
        where: [
            { looser: the_user.id },
            { winner: the_user.id },
        ],
    }
        )
        return list;
    }

    async getLeaderboard() : Promise<User[]> {
        const ordered = await this.userRepository.find(
        {
        order: { total_wins: "DESC", },
        select: ['avatar', 'login', 'total_wins'],
    });
    console.log(ordered);
        return ordered;
    }
}
