import connection from '../connection/database.js';

export async function getGames (req, res) {
  try {
    let name = '';

    if (req.query.name) name = `WHERE games.name LIKE '${req.query.name}%'`;

    const games = await connection.query({
        text: `
          SELECT games.*,
          categories.name as "categoryName" FROM categories
          JOIN games on games."categoryId" = categories.id
          ${name}
        `,
        rowMode: 'array'
    });
    res.send(games.rows.map(row => {
      const [id, name, image, stockTotal, categoryId, pricePerDay, categoryName] = row;

        return {
          id, name, image, stockTotal, categoryId, pricePerDay, categoryName
        }
    }));
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
}


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