import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";


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
    
}



export interface IMessage {
    id?: number;
    senderId?: number;
    roomId?: number;
    content?:string;
  
}