export declare class User implements IUser {
    id: number;
    intraId: string;
    login: string;
    avatar: string;
    email: string;
    authConfirmToken: Number;
    isVerified: boolean;
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
