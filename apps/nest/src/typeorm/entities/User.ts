import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity({ name: 'users' })
export class User implements IUser {
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

    @Column({nullable: true})
    authConfirmToken: Number;

    @Column({default: false, nullable: true})
    isVerified: boolean;

    @CreateDateColumn()
    createAt: Date;

    
}

export interface IUser {
        login: string;
        intraId: string;
        avatar: string;
        email: string;
        authConfirmToken: Number;
        isVerified: boolean;
        createAt: Date;
    }
