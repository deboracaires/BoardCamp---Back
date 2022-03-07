import Joi from 'joi';

const customerSchemma = Joi.object({
    name: Joi.string().min(1).required(),
    phone: Joi.string().min(10).max(11).required(),
    cpf: Joi.string().min(11).max(11).required(),
    birthday: Joi.date().less('now').required(),    
});

export default customerSchemma;