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
import {Step} from "./step.entity";


@Entity("lesson")
export class Lesson {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    public: boolean;

    @ManyToOne(() => User, user => user.lessons)
    @JoinColumn({name: "user_id"})
    user: User

    @OneToMany(()=>Step, steps => steps.lesson)
    @JoinTable()
    steps: Step[]

    @CreateDateColumn()
    createdDate: Date;

    @UpdateDateColumn()
    updatedDate: Date;
}
