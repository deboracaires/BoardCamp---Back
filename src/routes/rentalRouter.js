import { Router } from 'express';
import { getRentals, postRental } from '../controllers/rentalController.js';
import { validateNewRental } from '../middlewares/rentalMiddlewares.js';

const rentalRouter = Router();

rentalRouter.get('/rentals', getRentals);
rentalRouter.post('/rentals', validateNewRental,  postRental);

export default rentalRouter;