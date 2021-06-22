import { getRepository } from 'typeorm';
import { Movies } from '../entity/Movies';

export interface PrizeResults extends Array<PrizeResults> {
  producer: string;
  interval: number;
  previousWin: number;
  followingWin: number;
}

export const getPrizesByWinner = async (): Promise<PrizeResults> => {
	try {
		const producers: PrizeResults = await getRepository(Movies).query(`SELECT 
							gp.PRODUTOR as producer, 
							(followingWin - previousWin) as interval, 
							gp.previousWin, gp.followingWin 
					FROM
							(SELECT 
									count(gpa.PRODUTOR) as cont, 
									gpa.PRODUTOR, 
									MIN(gpa.ANO) as previousWin, 
									MAX(gpa.ANO) as followingWin
							FROM
									(SELECT 
											mv.winner as WIN,
											mv.producers as PRODUTOR, 
											mv.year as ANO
									FROM Movies as mv 
									WHERE WIN = 1
									GROUP BY PRODUTOR, ANO) as gpa
							WHERE gpa.WIN = 1 GROUP BY gpa.PRODUTOR) as gp
					WHERE gp.cont > 1 ORDER BY interval;`);

		return producers;
	} catch (e) {
		console.log(e);
	}
}