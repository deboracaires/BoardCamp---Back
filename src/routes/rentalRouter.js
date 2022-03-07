import { Router } from 'express';
import { deleteRental, finishRental, getRentals, postRental } from '../controllers/rentalController.js';
import { validateNewRental, verifyIdRental } from '../middlewares/rentalMiddlewares.js';

const rentalRouter = Router();

rentalRouter.get('/rentals', getRentals);
rentalRouter.post('/rentals', validateNewRental,  postRental);
rentalRouter.post('/rentals/:id/return', verifyIdRental, finishRental);
rentalRouter.delete('/rentals/:id', verifyIdRental, deleteRental);

export default rentalRouter;