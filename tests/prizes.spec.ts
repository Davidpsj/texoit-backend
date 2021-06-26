import { PrizeResults, getPrizesByWinner } from '../src/services/prizes';
import { Movies } from '../src/entity/Movies';
import typeorm = require('typeorm');

const sql_prizes = `SELECT t3.producer, t3.min as previousWin, t3.max as followingWin, (t3.max - t3.min) as interval FROM
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

describe('Prizes suit test', () => {

	it('should return min and max producers that won', async () => {
		const data = [
			{
				producer: 'Test',
				interval: 1,
				previousWin: 1982,
				followingWin: 1983,
			},
			{
				producer: 'Test 2',
				interval: 2,
				previousWin: 2010,
				followingWin: 2012,
			},
			{
				producer: 'Test 3',
				interval: 2,
				previousWin: 2019,
				followingWin: 2021,
			},
		] as PrizeResults;

		typeorm.getRepository = jest.fn().mockReturnValue({
			query: jest.fn().mockResolvedValue(data)
		});

		const result: PrizeResults = await getPrizesByWinner();

		expect(result).toBeDefined();
		expect(result.length).toBe(3 as number);
		
		const apiReturn: any = {
			min: [...result.filter((e: any) => e.interval === Math.min(...result.map((el: any) => el.interval)))],
			max: [...result.filter((e: any) => e.interval === Math.max(...result.map((el: any) => el.interval)))],
		};
		
		expect(apiReturn.min.length).toBe(1);
		expect(apiReturn.max.length).toBe(2);

		const repository = typeorm.getRepository;
		expect(repository).toHaveBeenNthCalledWith(1, Movies);
		expect(repository(Movies).query).toHaveBeenNthCalledWith(1, sql_prizes);
	});
});
