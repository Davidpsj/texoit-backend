import { Router } from 'express';
import { getDefaultAction } from './controller/GetDefaultAction';
import { getPrizeIntervals } from './controller/GetPrizeIntervals';

const routes = Router();

routes.get('/', getDefaultAction);

routes.get('/prize-interval', getPrizeIntervals);

export default routes;
