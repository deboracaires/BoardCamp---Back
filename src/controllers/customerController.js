import connection from '../connection/database.js';

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