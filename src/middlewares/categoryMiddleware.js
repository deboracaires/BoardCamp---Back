import newCategorySchemma from '../Schemmas/newCategorySchemma.js';
import connection from '../connection/database.js';

export async function validateNewCategory (req, res, next) {
  try {
    if (!req.body) return res.sendStatus(400);

    const validation = newCategorySchemma.validate(req.body);

    if (validation.error) return res.sendStatus(422);

    const verifyCategory = await connection.query('select * from categories where name = $1', [req.body.name]);

    if (verifyCategory.rowCount !== 0) return res.sendStatus(409);

    next();
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
}