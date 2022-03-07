import connection from '../connection/database.js';
import dayjs from 'dayjs';

export async function getCustomers (req, res) {
  try {
    let cpf = '';

    if (req.query.cpf) cpf = `WHERE customers.cpf LIKE '${req.query.cpf}%'`;

    const customers = await connection.query({
        text: `
          SELECT * FROM customers
          ${cpf}
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
    const id = req.params.id;

    const customer = await connection.query(`
      SELECT * FROM customers WHERE id = $1
    `, [id]);

    if (customer.rowCount === 0) return res.sendStatus(404);

    res.send(customer.rows);
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