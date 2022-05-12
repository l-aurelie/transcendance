import { User } from 'src/typeorm';
/*defines userDetails class used in auth.ts*/
export type UserDetails = {
    intraId: string;
}

export type Done = (err: Error, user: User) => void;