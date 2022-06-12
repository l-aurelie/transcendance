import { Entity, PrimaryGeneratedColumn, Column, UpdateDateColumn, CreateDateColumn, ManyToMany, JoinTable } from "typeorm";
import { User } from "src/typeorm";
import IUser from "src/typeorm/entities/User";

@Entity()
export class RoomEntity implements IRoom {

    @PrimaryGeneratedColumn()
    id: number;
 
    @Column({nullable: true})
    name:string;

    @Column({nullable:true})
    description:string;

    @ManyToMany(() => User)
    @JoinTable()
    users: User[];

    @Column()
    creatorId: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}



export interface IRoom {
    id?: number;
    name? : string;
    description?  : string;
    users? : IUser[];
    creatorId? : number;
    createdAt?: Date;
    updatedAt? : Date;
}