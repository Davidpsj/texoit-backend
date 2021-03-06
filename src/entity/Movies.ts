import { Entity, Column, ManyToMany, JoinTable, PrimaryColumn, ManyToOne } from 'typeorm';
import { Producers } from './Producers';
import { Prizes } from './Prizes';

@Entity()
export class Movies {
	@PrimaryColumn()
	title: string;

	@Column()
	studios: string;

	@ManyToMany(() => Producers, { eager: true, cascade: true })
		@JoinTable()
	producers: Array<Producers>;

	@ManyToOne(() => Prizes, prize => prize.movies, { eager: true })
	prizes?: Prizes;
}
