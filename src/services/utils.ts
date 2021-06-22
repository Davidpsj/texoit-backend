import fs from 'fs';
import { getRepository } from 'typeorm';
import { Movies } from '../entity/Movies';

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
			const [year, title, studios, producers, winner] = line.split(';');
			// Return the IMovie line extracted
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
	const movieData = readCsvFile(filename);

  let query: any;
  while (!(line = movieData.next()).done) {
    const { year, title, studios, producers, winner } = line.value;

    if (year && title) {
      query = await getRepository(Movies, 'default').findOne({
        where: {
          year: year,
          title: title,
          studios: studios,
          producers: producers,
          winner: winner,
        },
      });

      if (query === undefined) {
        const inserted = await getRepository(Movies, 'default').save({
          year: year,
          title: title,
          studios: studios,
          producers: producers,
          winner: winner,
        });

        count++;
      }
    }
  }

  return count;
}
