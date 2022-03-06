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