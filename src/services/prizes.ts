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
		let producers: PrizeResults = [] as PrizeResults;
		
		producers = await getRepository(Movies)
      .query(`SELECT t3.producer, t3.min as previousWin, t3.max as followingWin, (t3.max - t3.min) as interval FROM
        (
            SELECT t2.producer, min(t2.year) as min, max(t2.year) as max FROM 
            (
                
                SELECT t1.producer, t1.title, m.prizesYear as year FROM 
                (
                    SELECT mpp.producersName as producer, mpp.moviesTitle as title FROM movies_producers_producers as mpp
                    ORDER BY producer
                ) as t1
                INNER JOIN movies as m ON t1.title = m.title
                WHERE year IS NOT NULL 
                ORDER BY producer
            ) as t2
            GROUP BY t2.producer
        ) as t3
        WHERE interval > 0 ORDER BY interval`) as PrizeResults;

    return producers;
  } catch (e) {
    console.error(e);
  }
};

// export const getPrizesByWinnerOld = async (): Promise<PrizeResults> => {
// 	try {
// 		const movies = await getRepository(Movies)
// 			.createQueryBuilder('movies')
// 			// .where('winner = true')
// 			.orderBy('year')
// 			.getMany();
		
// 		const mov = movies.map(movie => ({
// 			...movie,
// 			// producers: movie.producers.split(/,\s|\sand\s|and\s/).filter(i => i !== ''),
// 		}))

// 		interface Aux {
//       year: number;
//       title: string;
//       studios: string;
//       producer: string;
//       winner: boolean;
//     }

// 		let normalized: Array<Aux> = [];
// 		for (let m of mov) {
// 			m.producers.forEach((prod:any) => {
// 				const aux = {
// 					// year: m.year,
// 					title: m.title,
// 					studios: m.studios,
// 					producer: prod,
// 					// winner: m.winner,
// 				} as Aux;

// 				normalized.push(aux);
// 			})
// 		}

// 		const producers: any = [];
// 		for (let m of normalized) {
// 			const filter: any = normalized.filter((i: any) => i.producer === m.producer)
			
// 			if (filter.length > 1) {
// 				let pr: PrizeResults = new Object() as PrizeResults;
// 				let min: number = Math.min(...filter.map((i:any) => i.year))
// 				let max: number = Math.max(...filter.map((i:any) => i.year))
// 				pr.producer = m.producer;
// 				pr.interval = max - min;
// 				pr.previousWin = min;
// 				pr.followingWin = max;

// 				if(producers.find((p:any) => p.producer === pr.producer) === undefined)
// 					producers.push(pr);
// 			}
// 		}

// 		console.log(producers);

// 		return producers;

// 		// let producers: PrizeResults;
		
//     // const producers: PrizeResults = await getRepository(Movies).query(`SELECT
//     // 					gp.PRODUTOR as producer,
//     // 					(followingWin - previousWin) as interval,
//     // 					gp.previousWin, gp.followingWin
//     // 			FROM
//     // 					(SELECT
//     // 							count(gpa.PRODUTOR) as cont,
//     // 							gpa.PRODUTOR,
//     // 							MIN(gpa.ANO) as previousWin,
//     // 							MAX(gpa.ANO) as followingWin
//     // 					FROM
//     // 							(SELECT
//     // 									mv.winner as WIN,
//     // 									mv.producers as PRODUTOR,
//     // 									mv.year as ANO
//     // 							FROM Movies as mv
//     // 							WHERE WIN = 1
//     // 							GROUP BY PRODUTOR, ANO) as gpa
//     // 					WHERE gpa.WIN = 1 GROUP BY gpa.PRODUTOR) as gp
//     // 			WHERE gp.cont > 1 ORDER BY interval;`);

//     // return producers;
//   } catch (e) {
// 		console.log(e);
// 	}
// }
