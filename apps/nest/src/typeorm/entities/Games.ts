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

    @Column({default: 125})
    posLeft : number;

    @Column({default: 225})
    posRight:number;

    @Column({default: 200})
    posBallX: number;

    @Column({default: 150})
    posBallY : number;

    @Column({default: 2})
    deltaX:number;
    
    @Column({default: -2})
    deltaY:number;

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
    deltaX?: number;
    deltaY?:number;
}