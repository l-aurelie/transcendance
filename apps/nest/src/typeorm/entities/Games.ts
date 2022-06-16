import { Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity()
export class Games implements IGames {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    playerLeft: number;

    @Column()
    playerRight:number;

    @Column({nullable:true})
    scoreLeft: number;

    @Column({nullable:true})
    scoreRight: number;

    @Column({nullable:true})
    winner: number;

    @Column({default:false})
    finish: boolean;

    @Column({default: 200})
    posLeft : number;

    @Column({default: 200})
    posRight:number;

    @Column({default: 400})
    posBallX: number;

    @Column({default: 400})
    posBallY : number;
}

export interface IGames {
    id?: number;
    playerLeft?: number;
    playerRight?: number;
    scoreLeft?: number;
    scoreRight?: number;
    winner?: number;
    finish?: boolean;
    posLeft?:number;
    posRight?:number;
    posBallX?: number;
    posBallY?: number;
}