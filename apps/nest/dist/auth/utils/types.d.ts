import { User } from 'src/typeorm';
export declare type UserDetails = {
    intraId: string;
};
export declare type Done = (err: Error, user: User) => void;
