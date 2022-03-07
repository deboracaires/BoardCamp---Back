import customerSchemma from '../Schemmas/customerSchemma.js';
import connection from '../connection/database.js';

export async function validateCustomer (req, res, next) {
  try {
    const validation = customerSchemma.validate(req.body);

    if (validation.error) return res.sendStatus(400);

    const verifyCpf = await connection.query(`SELECT * FROM customers WHERE "cpf" = $1`, [req.body.cpf]);

    if (verifyCpf.rowCount !== 0) return res.sendStatus(409);

    next();
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
}