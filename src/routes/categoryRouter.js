import { Router } from 'express';
import { validateNewCategory } from '../middlewares/categoryMiddleware.js';
import { getCategories, postCategory } from '../controllers/categoryController.js';

const categoryRouter = Router();

categoryRouter.get('/categories', getCategories);
categoryRouter.post('/categories', validateNewCategory, postCategory);

export default categoryRouter;