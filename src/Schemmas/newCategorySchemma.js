import Joi from 'joi';

const newCategorySchemma = Joi.object({
    name: Joi.string().required(),
});

export default newCategorySchemma;