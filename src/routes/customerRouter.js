import { Router } from 'express';
import { postCustomer } from '../controllers/customerController.js';
import { validateCustomer } from '../middlewares/customerMiddleware.js';

const customerRouter = Router();

customerRouter.post('/customers', validateCustomer, postCustomer);

export default customerRouter;