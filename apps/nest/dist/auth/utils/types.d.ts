import { User } from 'src/typeorm';
export declare type UserDetails = {
    username: string;
    discriminator: string;
    discordId: string;
    avatar: string;
};
export declare type Done = (err: Error, user: User) => void;
