import newRentalSchemma from '../Schemmas/newRentalSchemma.js';
import connection from '../connection/database.js';

export async function validateNewRental (req, res, next) {
  try {
    const validation = newRentalSchemma.validate(req.body);

    if (validation.error) return res.sendStatus(400);

    const verifyCustomer = await connection.query(`
      SELECT * FROM customers WHERE id = $1
    `, [req.body.customerId]);

    const verifyGame = await connection.query(`
      SELECT * FROM games WHERE id = $1
    `, [req.body.gameId]);

    let verifyDisponibility = await connection.query(`
      SELECT * FROM rentals WHERE "gameId" = $1
    `, [req.body.gameId]);

    verifyDisponibility.rows.filter((rental) => {
      if (rental.returnDate === null) return rental;
    });

    if (verifyCustomer.rowCount === 0 || verifyGame.rowCount === 0) return res.sendStatus(400);

    if (verifyDisponibility.rowCount >= verifyGame.rows[0].stockTotal) return res.sendStatus(400);

    res.locals.gameData = verifyGame.rows[0];
    
    next();
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
}