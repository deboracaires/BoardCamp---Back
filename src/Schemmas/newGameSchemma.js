import Joi from 'joi';

const newGameSchemma = Joi.object({
    name: Joi.string().min(1).required(),
    image: Joi.string().min(1).required(),
    stockTotal: Joi.number().min(1).required(),
    categoryId: Joi.number().min(1).required(),
    pricePerDay: Joi.number().min(1).required(),
});

export default newGameSchemma;