const express = require('express');

const app = express();
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();
const { MongoClient } = require('mongodb');


const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());

const uri = "mongodb+srv://contact-app:NpZcaj99rw1bwCEN@cluster0.faszq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db("contactApp");
        const contactsCollection = database.collection('contacts');

        //--------============ get services ==================
        app.get("/contacts/:mail", async (req, res) => {
            const emails = req.params.mail;
            const query = { mail: { $regex: emails } }
            const result = await contactsCollection.find(query).toArray();
            res.json(result)
        });
        //------------------- get contacts list -----------------
        app.get("/contacts", async (req, res) => {
            const cursor = contactsCollection.find();
            const contacts = await cursor.toArray();
            res.json(contacts);
        });
        // --------------------update contacts -------------------
        app.put('/contacts', async (req, res) => {
            const user = req.body;
            const filter = { email: user.email };
            const updateDoc = { $set: { name: req.body.name, email: req.body.email, phone: req.body.phone } };
            const result = await contactsCollection.updateOne(filter, updateDoc);
            res.json(result);
        })

        // ---------------------delete a contact --------------------

        app.delete("/contacts/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };

            const result = await contactsCollection.deleteOne(query);
            res.json(result)
        })
        //================= add a contact ====================
        app.post("/contacts", async (req, res) => {
            const contact = req.body;
            const result = await contactsCollection.insertOne(contact);
            res.json(result)
        })





        // ==================get a data by id =========================
        app.get("/contacts/:id", async (req, res) => {
            const id = req.params._id;
            const query = { _id: ObjectId(id) };
            const result = await contactsCollection.findOne(query);

            res.json(result)

        })

    }
    finally {
        // await client.close();
    }

}
run().catch(console.dir);
app.get("/", (req, res) => {
    res.send("running");
});
app.listen(port, () => {
    console.log("runing server on port", 5000);


})




