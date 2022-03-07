import { Router } from 'express';
import { getCustomerById, getCustomers, postCustomer, updateCustomer } from '../controllers/customerController.js';
import { validateCustomer, verifyId } from '../middlewares/customerMiddleware.js';

const customerRouter = Router();

customerRouter.get('/customers', getCustomers);
customerRouter.get('/customers/:id', verifyId, getCustomerById);
customerRouter.post('/customers', validateCustomer, postCustomer);
customerRouter.put('/customers/:id', validateCustomer, verifyId, updateCustomer);

export default customerRouter;