import customerSchemma from '../Schemmas/customerSchemma.js';
import connection from '../connection/database.js';
import dayjs from 'dayjs';

export async function validateCustomer (req, res, next) {
  try {
    const validation = customerSchemma.validate(req.body);

    if (validation.error) return res.sendStatus(400);

    const id = req.params.id;

    const verifyCpf = await connection.query(`SELECT * FROM customers WHERE "cpf" = $1`, [req.body.cpf]);

    if (!id) {
      if (verifyCpf.rowCount !== 0) return res.sendStatus(409);
    } else {
      if (Number(id) !== verifyCpf.rows[0].id) return res.sendStatus(409);
    }
    
    next();
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
}

export async function verifyId (req, res, next) {
  try {
    const id = req.params.id;

    const customer = await connection.query(`
      SELECT * FROM customers WHERE id = $1
    `, [id]);

    if (customer.rowCount === 0) return res.sendStatus(404);

    res.locals.customer = customer.rows.map(row => {
        const { id, name, phone, cpf, birthday } = row;

        return {
            id, name, phone, cpf, birthday: dayjs(birthday).format('MM/DD/YYYY')
        }
    });

    next();
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
}