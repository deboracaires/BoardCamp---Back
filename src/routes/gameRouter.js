import { Router } from 'express';
import { getGames, postGame } from '../controllers/gameController.js';
import { validateNewGame } from '../middlewares/gameMiddleware.js';

const gameRouter = Router();

gameRouter.get('/games', getGames);
gameRouter.post('/games', validateNewGame, postGame);

export default gameRouter;