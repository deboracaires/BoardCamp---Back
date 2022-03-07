import { Router } from 'express';
import { finishRental, getRentals, postRental } from '../controllers/rentalController.js';
import { validateNewRental } from '../middlewares/rentalMiddlewares.js';

const rentalRouter = Router();

rentalRouter.get('/rentals', getRentals);
rentalRouter.post('/rentals', validateNewRental,  postRental);
rentalRouter.post('/rentals/:id/return', finishRental);

export default rentalRouter;