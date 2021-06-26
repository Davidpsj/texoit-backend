import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Producers {
  @PrimaryColumn()
  name: string;
}
