import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";


@Entity()
export class Message implements IMessage {

    @PrimaryGeneratedColumn()
    id: number;
 
    @Column()
    senderId :number;

    @Column()
    roomID : number;

    @Column()
    content: string;

    @CreateDateColumn()
    createdAt: Date;
}



export interface IMessage {
    id?: number;
    senderId?: number;
    roomId?: number;
    content?:string;
  
}