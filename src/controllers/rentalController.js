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

export async function getRentals (req, res) {
  try {
    const rentals = await connection.query({
        text: `
          SELECT rentals.*, 
          customers.*,
          games.*,
          categories.*
          FROM rentals
          JOIN customers ON rentals."customerId"=customers.id
          JOIN games ON rentals."gameId"=games.id
          JOIN categories ON games."categoryId"=categories.id
        `,
        rowMode: 'array'
    });
    
    const rental = rentals.rows.map(row => {
        console.log(row);
      const [ id, customerId, gameId, rentDate, 
        daysRented, returnDate, originalPrice, delayFee, 
        idCustomer, name, phone, cpf, birthday, idGame, 
        gameName, image, stockTotal, categoryId, pricePerDay, idCategory, categoryName] = row;

      return { 
        id,
        customerId,
        gameId,
        rentDate,
        daysRented,
        returnDate,
        originalPrice,
        delayFee,
        customer: 
          {
            id: customerId, 
            name
          },
        game: {
          id: idGame,
          name: gameName,
          categoryId,
          categoryName,
        }
        }
    })


    res.send(rental)
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
}