import { Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { Movies } from './Movies';

@Entity()
export class Prizes {
  @PrimaryColumn()
  year: number;

  @OneToMany(() => Movies, movie => movie.prizes)
  movies: Array<Movies>;
}
