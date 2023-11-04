import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity("user")
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    role: string;

    @Column()
    email: string;

    @Column()
    password: string;

    @Column()
    firstName: string;

    @Column()
    surName: string;

    @Column()
    lastName: string;

    @Column()
    birthday: string;






}
