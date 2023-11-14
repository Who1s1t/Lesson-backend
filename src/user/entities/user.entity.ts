import {Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";
import {Lesson} from "../../lesson/entities/lesson.entity";
import {JoinTable} from "typeorm";

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

    @OneToMany(()=>Lesson, lessons => lessons.user)
    @JoinTable()
    lessons: Lesson[]


    @CreateDateColumn()
    createdDate: Date;

    @UpdateDateColumn()
    updatedDate: Date;



}
