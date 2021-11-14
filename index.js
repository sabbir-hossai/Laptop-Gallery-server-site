const express = require('express')
const cors = require('cors')
const app = express()
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config()
const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.l12hi.mongodb.net/Laptop_gallery?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
    try {
        await client.connect();
        const database = client.db("Laptop_gallery");
        const popularLaptopsCollection = database.collection("laptops");
        const confirmLaptopOrderCollection = database.collection("Orders");
        const reviewsCollection = database.collection("reviews");

        // order api start 
        app.post('/confirmOrders', async (req, res) => {
            const appointment = req.body;
            console.log(appointment)
            const result = await confirmLaptopOrderCollection.insertOne(appointment);
            console.log(`A document was inserted with the _id: ${result.insertedId}`);
            res.json(result)
        })

        app.get('/confirmOrders', async (req, res) => {
            const email = req.query.email;
            const query = { email: email }
            const cursor = confirmLaptopOrderCollection.find(query)
            const appointments = await cursor.toArray();
            res.json(appointments)
        })
        // delete api 
        app.delete('/confirmOrders/:id', async (req, res) => {
            const id = req.params.id;
            console.log('deleting with id', id);
            const query = { _id: ObjectId(id) };
            const result = await confirmLaptopOrderCollection.deleteOne(query);
            res.json(result);
        })
        // order api.......................... end 


        // app.get('/popularlaptops/:id', async (req, res) => {
        //     const email = req.query.email;
        //     const query = { email: email }
        //     const cursor = bookingCollection.find(query)
        //     const appointments = await cursor.toArray();
        //     res.json(appointments)
        // })
        app.get('/popularlaptops', async (req, res) => {
            // const email = req.query.email;
            // const query = { email: email }
            const cursor = popularLaptopsCollection.find({})
            const appointments = await cursor.toArray();
            res.json(appointments)
        })
        app.get('/popularlaptops/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const user = await popularLaptopsCollection.findOne(query);
            // console.log('load user with id: ', id);
            res.send(user);
        })

        // post reviews 

        app.post('/appointments', async (req, res) => {
            const appointment = req.body;
            console.log(appointment)
            const result = await reviewsCollection.insertOne(appointment);
            console.log(`A document was inserted with the _id: ${result.insertedId}`);
            res.json(result)
        })
        // get reviews ..................start 
        // post reviews 
        app.post('/reviews', async (req, res) => {
            const reviews = req.body;
            console.log(reviews)
            const result = await reviewsCollection.insertOne(reviews);
            console.log(`A document was inserted with the _id: ${result.insertedId}`);
            res.json(result)
        })
        // get api 
        app.get('/reviews', async (req, res) => {
            // const email = req.query.email;
            // const query = { email: email }
            const cursor = reviewsCollection.find({})
            const appointments = await cursor.toArray();
            res.json(appointments)
        })

        // get reviews ..................start 


    } finally {
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hello doctors portal')
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})