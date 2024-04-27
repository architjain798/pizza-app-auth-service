import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm'
import { User } from './User'

@Entity({ name: 'refreshTokens' })
export class RefreshToken {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ type: 'timestamp' })
    expiresAt: Date

    @ManyToOne(() => User)
    user: User

    @UpdateDateColumn()
    updated_at: number

    @CreateDateColumn()
    created_at: number
}
