export declare class User implements IUser {
    id: number;
    intraId: string;
    login: string;
    avatar: string;
}
export interface IUser {
    login: string;
    intraId: string;
    avatar: string;
}
