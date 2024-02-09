const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const knex = require('knex'); //postDate

// const testData = require('../testData'); include for test data
const db = require('./dbConfig');

const server = express();

/*middleware*/
server.use(express.json()); // tells to parse in json
server.use(cors()); //secures connection backend cross-platform
server.use(helmet()); //secure your express app by setting various http editors

/*middleware*/
/*endpoints*/
server.get('/', (req,res) => (
    res.send('Good luck lol')
));

server.get('/orderforms', async (req,res) => {
    //GET all orderforms
    //use test data temporarily
    // res.json(testData);
    try {
    const orderforms = await db('orderforms');
    // Send the JSON response
    res.status(200).json(orderforms);
  } catch (err) {
    res.status(500).json({ message: 'Internal Server Error.', error: err.message, stack: err.stack });
  }
});

server.get('/orderforms/:postDate', async (req,res) => {
    // GET orderform by postdate
    const { postDate } = req.params;
    if (!postDate) {
        return res.status(400).json({ message: 'Invalid request. Missing postDate.' });
    }

    try {
        const currentOrderForm = await db('orderforms').where({ postDate });
        currentOrderForm.length === 0 ? res.status(404).json({ message: 'Orderform not found'}) : res.status(200).json(currentOrderForm);
    } catch(err) {
        console.log(err)
    }
})

server.post('/orderforms', async (req,res) => {
    if (!req.body || !req.body.items) {
        return res.status(400).json({ message: 'Invalid request body. Missing items property.' });
    }

    const { items } = req.body;

    // Process each item and assign the current timestamp to postDate
    const processedItems = items.map(item => ({
        name: item.name,
        quantity: item.quantity,
        status: item.status,
        type: item.type,
        postDate: db.raw('CURRENT_TIMESTAMP'),
    }));
    if (!processedItems || processedItems.length === 0) {
        return res.status(400).json({ message: 'You must include items in your request.' });
    }
    try {
        await db('orderforms').insert(processedItems);
        res.status(201).json({ message: 'Order successfully stored!' });
    } catch(err) {
        console.error('Error processing JSON:', err);
        res.status(500).json({ message: 'Internal Server Error.' });
    }
});

// NOTE: this is the structure of how the data should be posted on the front-end
/*
    "items": [
        {
          "name": "Item 69",
          "quantity": 5,
          "status": "yo",
          "type": "lol"
        }
      ]
    }

*/
// server.put('/orderforms/:items/:postDate', async (req, res) => { //might need to fix if use --> will update all the orders with the same post dates
//     const { items } = req.body;

//     if (!items || items.length === 0) {
//         return res.status(400).json({ message: 'Invalid request. Missing postDate or items.' });
//     }

//     try {
//         // Assuming you want to update the orderforms with the specified postDate
//         await Promise.all(items.map(async (item) => {
//             const { postDate, ...rest } = item
//             if (postDate) {
                
//                 console.log('postdate:', postDate);
//                 console.log('other properties:', rest);
                
//                 await db('orderforms').where({ postDate }).update({ rest });
                
//             }
//         }))
    
//         res.status(200).json({ message: 'Order successfully updated!' });
//     } catch (err) {
//         console.log(err);
//         res.status(500).json({ message: 'Internal Server Error.' });
//     }
// });

server.delete('/orderforms/:postDate', async (req, res) => { // in actual url do not put the colon
    const { postDate } = req.params;

    if (!postDate) {
        return res.status(400).json({ message: 'Invalid request. Missing postDate.' });
    }

    try {
        console.log('postDate before deletion:', postDate);
        await db('orderforms').where({ postDate }).del();

        
        res.status(200).json({ message: 'Order successfully deleted!' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal Server Error.' });
    }
});



module.exports = server; //exports the server