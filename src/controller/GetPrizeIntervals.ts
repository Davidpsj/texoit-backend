import { Request, Response } from 'express';
import { getPrizesByWinner, PrizeResults } from '../services/prizes';

export const getPrizeIntervals = async (req: Request, res: Response) => {
	try {
		const result: Array<PrizeResults> = await getPrizesByWinner();
		// Filter Array<PrizeResults> to get the minimun intervals.
		const min: Array<PrizeResults> = [
			...result.filter((e: any) => e.interval === Math.min(
					...result.map((el: any) => el.interval))),
		];

		// Filter Array<PrizeResults> to get the maximun intervals.
		const max: Array<PrizeResults> = [
			...result.filter((e: any) => e.interval === Math.max(
				...result.map((el: any) => el.interval))),
		];

		res.json({ min, max });
	} catch (e) {
		res.status(500).json(e);
	}
}
