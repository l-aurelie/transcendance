import { Controller, Get, Post, Delete, Headers, UseGuards, Req, Param, Put, Body } from '@nestjs/common';
import { AuthenticatedGuard } from 'src/auth/guards';
import { StatsService } from './stats.service';


@Controller('stats')
export class StatsController {
   constructor(private statsServ : StatsService) {}
     /*Game stats*/
     @UseGuards(AuthenticatedGuard)
     @Get('getWins')
   async getWins(
     @Req() request,
    ) : Promise<number>
    {
       return this.statsServ.getWins(request.user);
    }

    @UseGuards(AuthenticatedGuard)
     @Get('getLosses')
    async getLosses(
     @Req() request,
    ) : Promise<number>
    {
       return this.statsServ.getLosses(request.user);
    }
}
