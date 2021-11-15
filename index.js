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
        const usersCollection = database.collection("laptopUsers");

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
        // manage all Order 
        app.get('/allOrders', async (req, res) => {
            // const email = req.query.email;
            // const query = { email: email }
            const cursor = confirmLaptopOrderCollection.find({})
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

        // all products 

        // create products 
        app.post('/productAdd', async (req, res) => {
            const appointment = req.body;
            console.log(appointment)
            const result = await popularLaptopsCollection.insertOne(appointment);
            console.log(`A document was inserted with the _id: ${result.insertedId}`);
            res.json(result)
        })



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

        // detele products 

        app.delete('/popularlaptops/:id', async (req, res) => {
            const id = req.params.id;
            console.log('deleting with id', id);
            const query = { _id: ObjectId(id) };
            const result = await popularLaptopsCollection.deleteOne(query);
            res.json(result);
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


        // user api .............  start
        app.post('/users', async (req, res) => {
            const user = req.body;
            console.log(user)
            const result = await usersCollection.insertOne(user);
            console.log(`A document was inserted with the _id: ${result.insertedId}`);
            res.json(result)
        })



        // user ..................... make admin 
        app.put('/users/admin', async (req, res) => {
            const user = req.body;
            console.log(user)
            const filter = { email: user.email };
            const updateDoc = { $set: { role: 'admin' } };
            const result = await usersCollection.updateOne(filter, updateDoc)
            res.json(result)

        })
        // get admin 
        app.get('/users/admin/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email }
            const user = await usersCollection.findOne(query);
            let isAdmin = false;
            if (user?.role === 'admin') {
                isAdmin = true;
            }
            res.json({ admin: isAdmin })
        })

    } finally {
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hello Laptop Gallery')
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})