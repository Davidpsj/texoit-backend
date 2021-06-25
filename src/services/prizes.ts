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
		const movies = await getRepository(Movies)
			.createQueryBuilder('movies')
			.where('winner = true')
			.orderBy('year')
			.getMany();
		
		const mov = movies.map(movie => ({
			...movie,
			producers: movie.producers.split(/,\s|\sand\s|and\s/).filter(i => i !== ''),
		}))

		interface Aux {
      year: number;
      title: string;
      studios: string;
      producer: string;
      winner: boolean;
    }

		let normalized: Array<Aux> = [];
		for (let m of mov) {
			m.producers.forEach(prod => {
				const aux = {
					year: m.year,
					title: m.title,
					studios: m.studios,
					producer: prod,
					winner: m.winner,
				} as Aux;

				normalized.push(aux);
			})
		}

		const producers: any = [];
		for (let m of normalized) {
			const filter: any = normalized.filter((i: any) => i.producer === m.producer)
			
			if (filter.length > 1) {
				let pr: PrizeResults = new Object() as PrizeResults;
				let min: number = Math.min(...filter.map((i:any) => i.year))
				let max: number = Math.max(...filter.map((i:any) => i.year))
				pr.producer = m.producer;
				pr.interval = max - min;
				pr.previousWin = min;
				pr.followingWin = max;

				if(producers.find((p:any) => p.producer === pr.producer) === undefined)
					producers.push(pr);
			}
		}

		console.log(producers);

		return producers;

		// let producers: PrizeResults;
		
    // const producers: PrizeResults = await getRepository(Movies).query(`SELECT
    // 					gp.PRODUTOR as producer,
    // 					(followingWin - previousWin) as interval,
    // 					gp.previousWin, gp.followingWin
    // 			FROM
    // 					(SELECT
    // 							count(gpa.PRODUTOR) as cont,
    // 							gpa.PRODUTOR,
    // 							MIN(gpa.ANO) as previousWin,
    // 							MAX(gpa.ANO) as followingWin
    // 					FROM
    // 							(SELECT
    // 									mv.winner as WIN,
    // 									mv.producers as PRODUTOR,
    // 									mv.year as ANO
    // 							FROM Movies as mv
    // 							WHERE WIN = 1
    // 							GROUP BY PRODUTOR, ANO) as gpa
    // 					WHERE gpa.WIN = 1 GROUP BY gpa.PRODUTOR) as gp
    // 			WHERE gp.cont > 1 ORDER BY interval;`);

    // return producers;
  } catch (e) {
		console.log(e);
	}
}
