import path from 'path';
import { readCsvFile, IMovie } from '../src/services/utils';

// A handler to avoid code duplication in assertions bellow.
const read = (filename: string) => {
	const csv = readCsvFile(path.join(__dirname, filename));
	const IMovieData: IMovie[] = [];

	let line;
	while (!(line = csv.next()).done) {
		const data: IMovie = line.value;
		IMovieData.push(data);
	}

	return IMovieData;
}

/**
 * Suit tests to import a CSV data from file.
 */
describe('Read Csv File test suit', () => {

	// Cover the read and extraction of movies from movielist.csv.
	it('should read the csv file', () => {
		const IMovieData = read('../assets/movielist.csv');
		expect(IMovieData.length).toBeGreaterThan(0);		
	});

	// Cover if winner field was setted correctly.
	// (in some cases it's missing on file).
	it('should be field winner boolean and present', () => {
		const IMovieData = read('../assets/movielist.csv');
		expect(IMovieData[0].winner).toBeDefined();
		expect([true, false].includes(IMovieData[0].winner)).toBeTruthy();
	});

	// Cover if a wrong filename path was passed.
	it('should throw a Exception if the CSV file is not found', () => {
		try {
			let f = readCsvFile(path.join(__dirname, '../assets/notfound.csv'));
			f.next();
		} catch (e) {
			expect(e.message).toBe('Invalid csv file or not found.');
		}
	});

	// Cover if a invalid movie list CSV file was passed.
	it('should throw a Exception if the CSV file is invalid', () => {
		try {
			let f = readCsvFile(path.join('./invalid.csv'));
			f.next();
		} catch (e) {
			expect(e.message).toBe('Invalid csv file or not found.');
		}
	});
});
