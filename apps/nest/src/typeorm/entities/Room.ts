import { Entity, PrimaryGeneratedColumn, Column, UpdateDateColumn, CreateDateColumn, ManyToMany, JoinTable, OneToOne, OneToMany } from "typeorm";
import { User } from "src/typeorm";
import IUser from "src/typeorm/entities/User";
import { RoomUser } from './RoomUser';

@Entity()
export class RoomEntity implements IRoom {

    @PrimaryGeneratedColumn()
    id: number;
 
    @Column({nullable: true})
    name:string;

    @Column({default: false})
    private: boolean;

    @Column({default: false})
    directMessage: boolean;

    @OneToMany(() => RoomUser, RoomUser => RoomUser.user)
    room_user: RoomUser[];

  //  @Column({nullable:true})
  //  description:string;

 //   @ManyToMany(() => User)
 //   @JoinTable()
 //   users: User[];
    @Column({nullable:true})
    password: string;

    @Column()
    creatorId: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
    
    // @ManyToMany(() => User, User => User.admin)
    // admin: User[];
}



export interface IRoom {
    id?: number;
    name? : string;
    private? : boolean;
    directMessage? : boolean;
    room_user?: RoomUser[];
    password?: string;
    creatorId? : number;
    createdAt?: Date;
    updatedAt? : Date;
    // admin?: User[];
}