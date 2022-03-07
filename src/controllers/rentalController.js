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

    let offset = '';

    if (req.query.offset) offset = `OFFSET ${req.query.offset}`;

    let limit = '';

    if (req.query.limit) limit = `LIMIT ${req.query.limit}`;

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
          ORDER BY 1
          ${customerId}
          ${gameId}
          ${offset}
          ${limit}
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
    const rental = res.locals.rental;

    const returnDate = dayjs().format('YYYY-MM-DD');
    const daysRented = rental.rows[0].daysRented;
    const rentDate = dayjs(rental.rows[0].rentDate).format('YYYY-MM-DD');
    
    const verifyDate = dayjs(rentDate).add(daysRented, 'day').format('YYYY-MM-DD');
    
    const finalDate = new Date(returnDate);
    const verifyFinalDate = new Date(verifyDate);

    const differenceInDays = (Math.abs(finalDate - verifyFinalDate)/(1000*60*60*24));

    let delayFee = 0;

    if(verifyDate < Math.abs(finalDate - verifyFinalDate)){
            
      delayFee = differenceInDays * (rental.rows[0].originalPrice / daysRented);

    }else{
      delayFee = null;
    }

    await connection.query(`
      UPDATE rentals SET "returnDate" = $2, "delayFee" = $3 WHERE id = $1
    `, [rental.rows[0].id, returnDate, delayFee]);
        
    res.sendStatus(200);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
}

export async function deleteRental (req, res) {
  try {
    const rental = res.locals.rental;

    await connection.query(`
      DELETE FROM rentals WHERE id = $1
    `, [rental.rows[0].id]);
    
    res.sendStatus(200);
  } catch (err) {
    console.log(err);
    return res.sendStatus(500);
  }
}