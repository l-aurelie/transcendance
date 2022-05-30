import { User } from 'src/typeorm';
/*defines userDetails class used in auth.ts*/
export type UserDetails = {
    login: any;
    intraId: any;
    avatar: any;
    email: any;
    authConfirmToken: number;
    jwt: string;
}

export type Done = (err: Error, user: User) => void;