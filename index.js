require('dotenv').config();

const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World');
    });

// MongoDB connection URI from environment variable
const uri = process.env.MONGODB_URI;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
serverApi: {
version: ServerApiVersion.v1,
strict: true,
deprecationErrors: true,
}
});

async function run() {
try {
// Connect the client to the MongoDB server
await client.connect();

// Access the "BookInventory" database and "books" collection
const bookCollection = client.db("BookInventory").collection("books");

// Endpoint to upload a new book to the database
app.post("/upload-book", async (req, res) => {
const data = req.body;
const result = await bookCollection.insertOne(data);
res.send(result);
});

// Endpoint to update a book's data
app.patch("/book/:id", async (req, res) => {
const id = req.params.id;
const updateBookData = req.body;
const filter = { _id: new ObjectId(id) };
const options = { upsert: true };

const updateDoc = {
$set: {
...updateBookData
}
};

const result = await bookCollection.updateOne(filter, updateDoc, options);
res.send(result);
});

// Endpoint to delete a book
app.delete("/book/:id", async (req, res) => {
const id = req.params.id;
const filter = { _id: new ObjectId(id) };
const result = await bookCollection.deleteOne(filter);
res.send(result);
});

// Endpoint to fetch all books or books by category
app.get("/all-books", async (req, res) => {
let query = {};
if (req.query?.category) {
query = { category: req.query.category };
}
const result = await bookCollection.find(query).toArray();
res.send(result);
});

// Endpoint to fetch a single book by its ID
app.get("/book/:id", async (req, res) => {
const id = req.params.id;
const filter = { _id: new ObjectId(id) };
const result = await bookCollection.findOne(filter);
res.send(result);
});

// Ping MongoDB deployment to confirm successful connection
await client.db("admin").command({ ping: 1 });
console.log("Pinged your deployment. You successfully connected to MongoDB!");
} finally {
// Ensure that the client will close when you finish or error
// await client.close();
}
}

// Run the async function to start the application
run().catch(console.dir);

// Start the express server
app.listen(port, () => {
console.log(`Express app listening on port ${port}`);
});
