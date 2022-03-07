import { Router } from 'express';
import { getCustomerById, getCustomers, postCustomer } from '../controllers/customerController.js';
import { validateCustomer } from '../middlewares/customerMiddleware.js';

const customerRouter = Router();

customerRouter.get('/customers', getCustomers);
customerRouter.get('/customers/:id', getCustomerById);
customerRouter.post('/customers', validateCustomer, postCustomer);

export default customerRouter;