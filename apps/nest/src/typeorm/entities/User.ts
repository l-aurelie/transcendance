/*samantha laura*/

import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToMany, OneToMany } from 'typeorm';
import { RoomEntity } from 'src/chat/model/room.entity';
import { Socket } from './Socket';
import { FriendRequest } from './friend-request';

@Entity({ name: 'users' })
export class User implements IUser { // donne la composition de User, permet de creer de nouvelles colonnes pour de nouvelles donnees concernant l'utilisateur, 
    @PrimaryGeneratedColumn({ name: 'user_no'})
    id: number;

    @Column({ name: 'Intra_id'})
    intraId: string;

    @Column({ name: 'Intra_login', nullable: true } )
    login: string;

    @Column({ name: 'Avatar_url', nullable: true })
    avatar: string;

    @Column({unique: true, nullable: true})
    email: string;

    @OneToMany(() => FriendRequest, FriendRequest => FriendRequest.sender)
    RequestsSent: FriendRequest[]; 

    @OneToMany(() => FriendRequest, FriendRequest => FriendRequest.receiver)
    RequestsReceived: FriendRequest[]; 

    @Column({default: undefined, nullable: true})
    authConfirmToken: number;

    @Column({default: true, nullable: true})
    isVerified: boolean;

    @Column({default: false, nullable: true})
    isConnected: boolean;
 
    @ManyToMany(() => RoomEntity, room => room.users)
    rooms : RoomEntity;
 
    @OneToMany(() => Socket, socket => socket.user)
    socket: Socket[];

    @CreateDateColumn()
    createAt: Date;

    
}

interface IUser {
        login: string;
        intraId: string;
        avatar: string;
        email: string;
        authConfirmToken: number;
        isVerified: boolean;
        createAt: Date;
    }
    export default IUser;
