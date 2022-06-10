
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from './User';

@Entity({ name: 'sockets' })
export class Socket implements ISocket {
    @PrimaryGeneratedColumn({ name: 'socket_no'})
    id: number;

    @Column()
    name: string;


    @ManyToOne(() => User, user => user.socket)
    user : User;
}

interface ISocket {
        name: string
        user: User;
    }

export default ISocket;
