import { Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity()
export class RoomUser implements IRoomUser {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    userId : number;
    
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
    roomId? : number;
    mute?: boolean;
    ban?: boolean;
    expiredMute?: Date;
    expiredBan?:Date;
}