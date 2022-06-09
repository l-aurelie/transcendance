import IUser from "src/typeorm/entities/User";

export interface IRoom {
    id?: number;
    name? : string;
    description?  : string;
    users? : IUser[];
    createdAt?: Date;
    updatedAt? : Date;
}