/*samantha laura*/

import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

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

  //  @Column()
  //  password:string;

    @Column({default: undefined, nullable: true})
    authConfirmToken: Number;

    @Column({default: true, nullable: true})
    isVerified: boolean;

    @Column({default: false, nullable: true})
    isConnected: boolean;

    @Column({nullable: true})
    jwt: string;

    @CreateDateColumn()
    createAt: Date;

    
}

interface IUser {
        login: string;
        intraId: string;
        avatar: string;
        email: string;
        authConfirmToken: Number;
        isVerified: boolean;
        createAt: Date;
    }
    export default IUser;
