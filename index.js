const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config(); // Load environment variables from .env file

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB URI validation
const connectionString = process.env.MONGODB_URI;

if (!connectionString || !connectionString.startsWith('mongodb+srv://')) {
console.error('Invalid MongoDB URI in environment variables.');
process.exit(1);
}

// MongoDB connection setup
const client = new MongoClient(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
try {
await client.connect();
console.log('Connected to MongoDB');

const database = client.db('BookInventory');
const collection = database.collection('books');

// Example route: Get all books
app.get('/books', async (req, res) => {
const books = await collection.find({}).toArray();
res.json(books);
});

// Example route: Insert a new book
app.post('/books', async (req, res) => {
const newBook = req.body;
const result = await collection.insertOne(newBook);
res.json(result);
});

// More routes and MongoDB operations can be added here...

} catch (error) {
console.error('Error connecting to MongoDB:', error);
process.exit(1);
}
}

run().catch(console.error);

// Start the server
app.listen(port, () => {
console.log(`Server is running on http://localhost:${port}`);
});
