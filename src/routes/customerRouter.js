import { Router } from 'express';
import { getCustomers, postCustomer } from '../controllers/customerController.js';
import { validateCustomer } from '../middlewares/customerMiddleware.js';

const customerRouter = Router();

customerRouter.get('/customers', getCustomers);
customerRouter.post('/customers', validateCustomer, postCustomer);

export default customerRouter;