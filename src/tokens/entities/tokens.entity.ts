import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Column,
  BeforeInsert,
} from 'typeorm';
import { hash, genSalt } from 'bcrypt';
import { Exclude } from 'class-transformer';

@Entity('tokens')
export class Tokens {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  originalUrl: string;

  @Column({ unique: true })
  token: string;

  @Column({ nullable: true })
  deathDate: Date;

  @Column({ nullable: true })
  connectQty: number;

  @Column({ nullable: true })
  hashedPassword: string;

  @CreateDateColumn()
  createdAt: Date;

  @BeforeInsert()
  async hashPassword() {
    if (this.hashedPassword) {
      const salt = await genSalt(10);
      this.hashedPassword = await hash(this.hashedPassword, salt);
    }
  }
}
