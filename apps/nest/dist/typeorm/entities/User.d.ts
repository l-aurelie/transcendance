export declare class User implements IUser {
    id: number;
    discordId: string;
    username: string;
    discriminator: string;
    avatar: string;
}
export interface IUser {
    username: string;
    discriminator: string;
    discordId: string;
    avatar: string;
}
