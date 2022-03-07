import connection from '../connection/database.js';
import dayjs from 'dayjs';

export async function getCustomers (req, res) {
  try {
    let cpf = '';

    if (req.query.cpf) cpf = `WHERE customers.cpf LIKE '${req.query.cpf}%'`;

    let offset = '';

    if (req.query.offset) offset = `OFFSET ${req.query.offset}`;

    let limit = '';

    if (req.query.limit) limit = `LIMIT ${req.query.limit}`;

    const customers = await connection.query({
        text: `
          SELECT * FROM customers
          ORDER BY 1
          ${cpf}
          ${offset}
          ${limit}
        `
    });

    res.send(customers.rows.map(row => {
        const { id, name, phone, cpf, birthday } = row;

        return {
            id, name, phone, cpf, birthday: dayjs(birthday).format('MM/DD/YYYY')
        }
    }));
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
}

export async function getCustomerById (req, res) {
  try {
    const customer = res.locals.customer;

    res.send(customer[0]);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
}

export async function postCustomer (req, res) {
  try {
    const {
      name,
      phone,
      cpf,
      birthday,
    } = req.body;

    await connection.query(`
      INSERT INTO customers ("name", "phone", "cpf", "birthday")
      VALUES ($1, $2, $3, $4)
    `, [name, phone, cpf, birthday]);

    res.sendStatus(201);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
}

export async function updateCustomer (req, res) {
  try {
    const id = req.params.id;

    const {
      name,
      phone,
      cpf,
      birthday,
    } = req.body;

    await connection.query(`
      UPDATE customers SET name = $2, phone = $3, cpf = $4, birthday = $5 WHERE id = $1;
    `, [id, name, phone, cpf, birthday]);
    
    res.sendStatus(200);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
}