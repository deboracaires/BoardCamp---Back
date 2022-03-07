import connection from '../connection/database.js';

export async function getCategories(req, res) {
  try {
    let offset = '';

    if (req.query.offset) offset = `OFFSET ${req.query.offset}`;

    let limit = '';

    if (req.query.limit) limit = `LIMIT ${req.query.limit}`;

    const result = await connection.query({
      text: `
        SELECT * FROM categories
        ORDER BY 1
        ${offset}
        ${limit}
        `
    });
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