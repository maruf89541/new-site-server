const express = require('express');
const { MongoClient } = require('mongodb');
const objectId = require('mongodb').ObjectId

const cors = require('cors');
require('dotenv').config()



const app = express();
const port = process.env.PORT || 5000;

//midleware
app.use(cors());
app.use(express.json())

const uri = `mongodb+srv://marufdbuser01:${process.env.DB_PASS}@cluster0.gjp6v.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

console.log(uri);

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });



async function run() {
    try {
        await client.connect();
        console.log('connected to database');

        const database = client.db("marufcommerce");
        const serviceCollection = database.collection("services");

        //get api
        app.get('/services', async (req, res) => {
            const cusrsor = serviceCollection.find({});
            const services = await cusrsor.toArray();
            res.send(services)
        })
        //get single service 
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: objectId(id) }
            const service = await serviceCollection.findOne(query);
            res.json(service);
        })

        //  POST API

        app.post('/services', async (req, res) => {
            const service = req.body;
            console.log('hit the post api');


            const result = await serviceCollection.insertOne(service);
            console.log(result);
            res.json(result);
        })
    }
    finally {

    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Runing new site');
});

app.listen(port, () => {
    console.log('Runing new site', port);
})