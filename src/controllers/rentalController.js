import connection from '../connection/database.js';
import dayjs from 'dayjs';

export async function postRental (req, res) {
  try {
    const {
      customerId,
      gameId,
      daysRented,
    } = req.body;

    const rentDate = dayjs().format('MM/DD/YYYY');
    
    const originalPrice = Number(res.locals.gameData.pricePerDay) * daysRented;

    await connection.query(`
      INSERT INTO rentals 
      ("customerId", "gameId", "rentDate", "daysRented", "returnDate", "originalPrice", "delayFee")
      VALUES ($1, $2, $3, $4, $5, $6, $7)
    `, [customerId, gameId, rentDate, daysRented, null, originalPrice, null]);

    res.sendStatus(201);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
}