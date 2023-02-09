import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Column,
  BeforeInsert,
} from 'typeorm';
import { hash, genSalt } from 'bcrypt';
import Hashids from 'hashids/cjs/hashids';

@Entity('tokens')
export class Tokens {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
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
  async hashUrl() {
    const hasher = new Hashids(this.originalUrl, 3);
    this.token = hasher.encode(this.originalUrl.length);
  }
  @BeforeInsert()
  async hashPassword() {
    if(this.hashedPassword){
      const salt = await genSalt(10);
      this.hashedPassword = await hash(this.hashedPassword, salt);
    }
  }
}
