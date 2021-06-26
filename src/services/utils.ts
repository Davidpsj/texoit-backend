import fs from 'fs';
import { getRepository } from 'typeorm';
import { Movies } from '../entity/Movies';
import { Producers } from '../entity/Producers';
import { Prizes } from '../entity/Prizes';

/**
 * Interface IMovie that references the data structure of CSV to import.
 */
export interface IMovie {
	year: number;
	title: string;
	studios: string;
	producers: string;
	winner: boolean;
}

/**
 * Function generator that read a CSV File and return a IMovie data type if possible.
 * @param filename string that reference to a stream a CSV file readable.
 */
export const readCsvFile = function* (filename: string): Generator {
	try {
		// Reads the file.
		const data = fs.readFileSync(filename, 'utf-8');

		// Extract the file lines.
		let lines = data.split('\n');

		// Remove header
		lines.shift();

		// Iterate lines and extract fields to IMovie interface data.
		for (let line of lines) {
			console.log('line', line);
			const [year, title, studios, producers, winner] = line.split(';');

			if(line !== '')
				yield { year: parseInt(year), title, studios, producers, winner: winner === 'yes' } as IMovie;
		}

		return true;
	} catch (ex) { // Throw an exception if some error is catched.
		throw Error('Invalid csv file or not found.');
	}
}

export const insertData = async (filename: string): Promise<number> => {
	let line: any;
	let count: number = 0;
	let prize: Prizes | undefined;
	let movie: Movies | undefined;
	let res: any;

	// Get file line from generator.
	const movieData = readCsvFile(filename);

	try {

		while (!(line = movieData.next()).done) {
      const { year, title, studios, producers, winner } = line.value;

      // Producers lines
      const prodNames = producers.split(/,\s|and\s|\sand\s/).filter((i: any) => i !== '');

      // Check if the current line movie is present in the database.
      const exists: Movies[] = await getRepository(Movies).find({ title });

      // Create a instance of Movies
      movie = new Movies();
      movie.title = title;
      movie.studios = studios;
      // Put on it all producers.
      movie.producers = [...prodNames.map((prod: string): Producers => ({ name: prod } as Producers))];

      // If exists and returned data is an array zero-length.
      if (exists && Array.isArray(exists) && exists.length === 0) {
        // If movie is winner
        if (winner) {
          // Check if the year prize is present.
          prize = await getRepository(Prizes)
            .createQueryBuilder('prize')
            .where('prize.year = :year', { year })
            .getOne();

          // If prizeData is present
          if (prize !== undefined) {
            movie.prizes = prize;
          } else {
            prize = new Prizes();
            prize.year = year;
            // prize.movies = [movie]
            // prize.movies
            prize = await getRepository(Prizes).save(prize);
            movie.prizes = prize;
          }

          // Send Movie data to database.
          res = await getRepository(Movies).save(movie);

          if (res) {
            // Increment count
						count++;
						res = null;
          }
				} else {
					res = await getRepository(Movies).save(movie);
					// Increment count
					count++;
					res = null;
        }

        // console.log('WINNER TRUE --- ', winner);
        // let prize: Prizes = null;
        // prize = await getRepository(Prizes).createQueryBuilder().where('year = :year', { year }).getOne();
        // console.log('PRIZE --- ', prize);
        // if (prize) {
        // 	prize.movies = [res];
        // 	await getRepository(Prizes).save(prize);
        // } else {
        // 	prize = new Prizes();
        // 	prize.year = year;
        // 	prize.movies = [res];
        // 	console.log('PRIZE UPDATING --- ', prize);
        // 	await getRepository(Prizes).save(prize);
        // }
      }

      // if (year && title) {
      //   query = await getRepository(Movies, 'default').findOne({
      //     where: {
      //       year: year,
      //       title: title,
      //       studios: studios,
      //       producers: producers,
      //       winner: winner,
      //     },
      //   });

      //   if (query === undefined) {
      //     const inserted = await getRepository(Movies, 'default').save({
      //       year: year,
      //       title: title,
      //       studios: studios,
      //       producers: producers,
      //       winner: winner,
      //     });

      //     count++;
      //   }
      // }
    }
	} catch (e) {
		console.log(e);
	}

  return count;
}
