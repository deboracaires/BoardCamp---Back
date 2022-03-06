import connection from '../connection/database.js';

export async function postGame (req, res) {
  try {
    const {
      name,
      image,
      stockTotal,
      categoryId,
      pricePerDay,
    } = req.body;

    await connection.query(`
        INSERT INTO games ("name", "image", "stockTotal", "categoryId", "pricePerDay") VALUES ($1, $2, $3, $4, $5)`,
     [name, image, Number(stockTotal), categoryId, Number(pricePerDay)]);

    res.sendStatus(201);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
}