import { getRepository } from 'typeorm';
import { Movies } from '../entity/Movies';

export const sqlQuery = `SELECT t3.producer, t3.min as previousWin, t3.max as followingWin, (t3.max - t3.min) as interval FROM
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
        WHERE interval > 0 ORDER BY interval`;

export interface PrizeResults extends Array<PrizeResults> {
  producer: string;
  interval: number;
  previousWin: number;
  followingWin: number;
};

export const getPrizesByWinner = async (): Promise<PrizeResults> =>
  (await getRepository(Movies).query(sqlQuery)) as PrizeResults;
