import { Entity, PrimaryGeneratedColumn, Column, UpdateDateColumn, CreateDateColumn, ManyToMany, JoinTable } from "typeorm";
import { User } from "src/typeorm";

@Entity()
export class RoomEntity {

    @PrimaryGeneratedColumn()
    id: number;
 
    @Column()
    name:string;

    @Column()
    description:string;

    @ManyToMany(() => User)
    @JoinTable()
    users: User[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}