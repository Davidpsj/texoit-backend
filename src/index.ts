import 'reflect-metadata';
import path from 'path';
import express from 'express';
import { createConnection } from 'typeorm'
import routes from './routes';
import { insertData } from './services/utils';

const app = express();
createConnection().then(async connection => {
	app.use(express.json(), express.urlencoded({ extended: true }));
	app.use('/api', routes);

	app.get('/', (req: any, res: any) => res.json({
		message: `Welcome to TexoIT Test. The api is available in /api.`
	}))

	const filename = path.resolve(__dirname, '../assets/movielist.csv');
	console.log(filename);
	const insertedData = await insertData(filename);
	
	app.listen(3000, () => `Welcome to TexoIT API! ${insertedData === 0 ? 'No' : insertedData} new data was inserted.`);
}).catch(err => console.log(err));
