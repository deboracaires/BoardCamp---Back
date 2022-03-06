import connection from '../connection/database.js';

export async function getCategories(req, res) {
  try {
    const result = await connection.query(`SELECT * FROM categories`);
    res.send(result.rows);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
}

export async function postCategory(req, res) {
  try {
    await connection.query('INSERT INTO categories (name) VALUES ($1)', [req.body.name]);

    res.sendStatus(201);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
}