import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Producers {
  // @PrimaryGeneratedColumn()
  // id: number;

  // @Column({ unique: true })
  @PrimaryColumn()
  name: string;
}
