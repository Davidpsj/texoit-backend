import { PrizeResults, getPrizesByWinner, sqlQuery } from '../src/services/prizes';
import { Movies } from '../src/entity/Movies';
import typeorm = require('typeorm');

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
      query: jest.fn().mockResolvedValue(data),
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
    expect(repository(Movies).query).toHaveBeenNthCalledWith(1, sqlQuery);
  });
});
