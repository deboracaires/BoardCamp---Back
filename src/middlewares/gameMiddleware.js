import newGameSchemma from '../Schemmas/newGameSchemma.js';
import connection from '../connection/database.js';

export async function validateNewGame (req, res, next) {
  try {
    const {
      name,
      image,
      stockTotal,
      categoryId,
      pricePerDay,
    } = req.body;

    const numberStock = Number(stockTotal);
    const numberPrice = Number(pricePerDay);

    const validation = newGameSchemma.validate(
        {
          name,
          image,
          stockTotal: numberStock,
          pricePerDay: numberPrice,
          categoryId
        });

    const verifyCategory = await connection.query('SELECT * FROM categories WHERE id = $1', [categoryId]);
    
    if (validation.error || verifyCategory.rowCount === 0) return res.sendStatus(400);

    const verifyName = await connection.query('SELECT * FROM games WHERE name = $1', [name]);

    if (verifyName.rowCount !== 0) return res.sendStatus(409);

    next();
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
}