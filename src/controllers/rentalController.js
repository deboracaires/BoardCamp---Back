import connection from '../connection/database.js';
import dayjs from 'dayjs';

export async function postRental (req, res) {
  try {
    const {
      customerId,
      gameId,
      daysRented,
    } = req.body;

    const rentDate = dayjs().format('DD/MM/YYYY');
    
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
    let customerId = '';

    if (req.query.customerId) customerId = `WHERE customers.id = ${req.query.customerId}`;
    
    let gameId = '';

    if (req.query.gameId) gameId = `WHERE games.id = ${req.query.gameId}`;

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
          ${customerId}
          ${gameId}
        `,
        rowMode: 'array'
    });
    
    const rental = rentals.rows.map(row => {
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

export async function finishRental (req, res) {
  try {
    const id = req.params.id;

    const verifyId = await connection.query(`
      SELECT * FROM rentals WHERE id = $1
    `, [id]);

    if (verifyId.rowCount === 0) return res.sendStatus(404);

    if (verifyId.rows[0].returnDate !== null) return res.sendStatus(400);

    const returnDate = dayjs().format('YYYY-MM-DD');
    const daysRented = verifyId.rows[0].daysRented;
    const rentDate = dayjs(verifyId.rows[0].rentDate).format('YYYY-MM-DD');
    
    const verifyDate = dayjs(rentDate).add(daysRented, 'day').format('YYYY-MM-DD');
    
    const finalDate = new Date(returnDate);
    const verifyFinalDate = new Date(verifyDate);

    const differenceInDays = (Math.abs(finalDate - verifyFinalDate)/(1000*60*60*24));

    let delayFee = 0;

    if(verifyDate < Math.abs(finalDate - verifyFinalDate)){
            
      delayFee = differenceInDays * (verifyId.rows[0].originalPrice / daysRented);

    }else{
      delayFee = null;
    }

    await connection.query(`
      UPDATE rentals SET "returnDate" = $2, "delayFee" = $3 WHERE id = $1
    `, [id, returnDate, delayFee]);
        
    res.sendStatus(200);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
}