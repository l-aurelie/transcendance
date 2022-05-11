import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'users' })
export class User implements IUser {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'discord_id', unique: true})
    discordId: string;

    @Column()
    username: string;

    @Column()
    discriminator: string;

    @Column({ nullable: true })
    avatar: string;
}

export interface IUser {
        username: string;
        discriminator: string;
        discordId: string;
        avatar: string;
    }
