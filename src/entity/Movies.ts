import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Movies {

	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	year: number;

	@Column()
	title: string;

	@Column()
	studios: string;
	
	@Column()
	producers: string;
	
	@Column()
	winner: boolean;
}
