const express = require('express');
const cors = require('cors');
require('dotenv').config()
const jwt = require('jsonwebtoken');
const app = express();
const port = process.env.PORT || 5000;
app.use(express.json());
app.use(cors());

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.9tf8i.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const itemCollection = client.db('mobilePoint').collection('item');

        app.post('/login', async (req, res) => {
            const email = req.body;
            
            const token = jwt.sign(email, process.env.JWT_TOKEN);
            console.log(token);
        })

        app.get('/item', async (req, res) => {
            const query = {};
            const cursor = itemCollection.find(query);
            const items = await cursor.toArray();
            res.send(items);
        })
        // app.get('/item', async (req, res) => {
        //     const email = req.query.email;
        //     console.log(email);
        //     const query = {};
        //     const cursor = itemCollection.find(query);
        //     const items = await cursor.toArray();
        //     res.send(items);
        // })

        app.get('/item/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const item = await itemCollection.findOne(query);
            res.send(item);
        })

        

        app.post('/addItem', async (req, res) => {
            const item = req.body;
            const result = await itemCollection.insertOne(item);
            res.send({success:"Item Added"});
        })

        app.delete('/item/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await itemCollection.deleteOne(query);
            res.send(result);
        })


    } finally {
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Welcome to Mobile Point')
});

app.listen(port, () => {
    console.log("Running in port:", port);
});