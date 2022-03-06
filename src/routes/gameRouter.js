import { Router } from 'express';
import { postGame } from '../controllers/gameController.js';
import { validateNewGame } from '../middlewares/gameMiddleware.js';

const gameRouter = Router();

gameRouter.post('/games', validateNewGame, postGame);

export default gameRouter;