import { Module } from '@nestjs/common';
import { GameGateway } from './game.gateway'
// import { User } from 'src/typeorm';
// import { SocketService, UsersService } from 'src/users/users.service';
// import { UsersModule } from 'src/users/users.module';


@Module({
    // before the gateway will start we need to add oit to the providers here
    //imports: [TypeOrmModule.forFeature([RoomEntity])],
    providers: [GameGateway]
})
export class GameModule {}