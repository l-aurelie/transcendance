export declare class User implements IUser {
    id: number;
    intraId: string;
    login: string;
    discriminator: string;
    avatar: string;
}
export interface IUser {
    login: string;
    discriminator: string;
    intraId: string;
    avatar: string;
}
