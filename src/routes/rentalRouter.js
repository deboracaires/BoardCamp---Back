import { Router } from 'express';
import { postRental } from '../controllers/rentalController.js';
import { validateNewRental } from '../middlewares/rentalMiddlewares.js';

const rentalRouter = Router();

rentalRouter.post('/rentals', validateNewRental,  postRental);

export default rentalRouter;