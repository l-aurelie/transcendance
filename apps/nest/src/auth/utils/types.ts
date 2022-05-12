import { User } from 'src/typeorm';
/*defines userDetails class used in auth.ts*/
export type UserDetails = {
    username: string;
    discriminator: string;
    discordId: string;
    avatar: string;
}

export type Done = (err: Error, user: User) => void;