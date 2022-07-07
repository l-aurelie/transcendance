/* aurelie */

import {Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToOne} from "typeorm"
import { User } from "./User"

/* Choosen avatar uploaded in DB */
@Entity()
export class Avatar implements IAvatar{

    @PrimaryGeneratedColumn()
    id: number 


    @Column()
    name: string

    /* equivalent type blob postgres */
    @Column({
        type: "bytea"
    })
    data: Uint8Array

    @Column()
    mimeType:string

    @OneToOne(() => User, user => user.Avatar2)
    user : User;
}

interface IAvatar {
    id:number;
    name: string;
    data: Uint8Array;
    mimeType: string;
    user : User;
}
export default IAvatar;
