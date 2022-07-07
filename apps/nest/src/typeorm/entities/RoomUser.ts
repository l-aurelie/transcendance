import { Entity, PrimaryGeneratedColumn, Column, ManyToOne} from "typeorm";
import { User } from './User';

@Entity()
export class RoomUser implements IRoomUser {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    userId : number;

    @ManyToOne(() => User, User => User.RequestsSent)
    user : User;
    
    @Column()
    roomId: number;

    @Column({default:false})
    mute: boolean;

    @Column({default:false})
    ban : boolean;

    @Column({nullable:true})
    expiredMute: Date;

    @Column({nullable:true})
    expireBan: Date;
}

export interface IRoomUser {
    id?: number;
    userId? : number;
    user? : User;
    roomId? : number;
    mute?: boolean;
    ban?: boolean;
    expiredMute?: Date;
    expiredBan?:Date;
}