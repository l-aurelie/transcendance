import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'users' })
export class User implements IUser {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'discord_id', nullable: true })
    intraId: string;

    @Column({ nullable: true } )
    login: string;

    @Column({ nullable: true })
    discriminator: string;

    @Column({ nullable: true })
    avatar: string;
}

export interface IUser {
        login: string;
        discriminator: string;
        intraId: string;
        avatar: string;
    }
