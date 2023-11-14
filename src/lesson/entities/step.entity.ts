import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn, JoinTable,
    ManyToOne, OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {User} from "../../user/entities/user.entity";
import {Lesson} from "./lesson.entity";


@Entity("step")
export class Step {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    number: number;

    @Column()
    text: string;

    @Column()
    image: number;

    @ManyToOne(() => Lesson, lesson => lesson.steps)
    @JoinColumn({name: "lesson_id"})
    lesson: Lesson

    @CreateDateColumn()
    createdDate: Date;

    @UpdateDateColumn()
    updatedDate: Date;
}