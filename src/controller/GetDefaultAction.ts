// import { getRepository } from 'typeorm';
// import { Movies } from '../entity/Movies';
import { Request, Response } from 'express';
// import { readCsvFile } from '../services/utils';
// import path from 'path';

export const getDefaultAction = async (req: Request, res: Response) : Promise<any> => {
  // let count: number = 0;
  // let line;
  try {
  //   const movieData = readCsvFile(path.join(__dirname, '../../assets/movielist.csv'));

	// 	let query; 
  //   while (!(line = movieData.next()).done) {
	// 		const { year, title, studios, producers, winner } = line.value;

	// 		if (year && title) {
	// 			query = await getRepository(Movies, 'default')
	// 				.findOne({
	// 					where: {
	// 						year: year,
	// 						title: title,
	// 						studios: studios,
	// 						producers: producers,
	// 						winner: winner,
	// 					},
	// 				});
				
	// 			if (query === undefined) {
	// 				const inserted = await getRepository(Movies, 'default').save({
	// 					year: year,
	// 					title: title,
	// 					studios: studios,
	// 					producers: producers,
	// 					winner: winner,
	// 				});
					
	// 				count++;
	// 			}
	// 		}
	// 	}
		
		let message = 'Welcome to TexoIT API Test! To get prizes, please access: /prize-interval.';

		res.json({
			message,
			// first_access: count !== 0,
			// status: `${count === 0 ? 'No': count} new data was inserted.`,
		});
  } catch (e) {
    res.status(500).json(e);
  }
};
