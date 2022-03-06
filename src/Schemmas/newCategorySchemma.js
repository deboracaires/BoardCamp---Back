import Joi from 'joi';

const newCategorySchemma = Joi.object({
    name: Joi.string().min(1).required(),
});

export default newCategorySchemma;