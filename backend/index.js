const express = require('express');
const app = express();
const port = 3001;
const fs = require('fs');
const cors = require('cors');

app.use(cors());
app.use(express.json());

// Load data from JSON files
const books = JSON.parse(fs.readFileSync('./backend/data/books.json', 'utf-8'));
const categories = JSON.parse(fs.readFileSync('./backend/data/categories.json', 'utf-8'));

// Get all books
app.get('/books', (req, res) => {
  res.json(books);
});

// Sort books by title, category, or author
app.get('/books/sort/:field', (req, res) => {
  const { field } = req.params;
  if (['title', 'category', 'author'].includes(field)) {
    const sortedBooks = [...books].sort((a, b) => a[field].localeCompare(b[field]));
    res.json(sortedBooks);
  } else {
    res.status(400).json({ message: 'Invalid sort field' });
  }
});

// Get all categories
app.get('/categories', (req, res) => {
  res.json(categories);
});

// Add a new category
app.post('/categories', (req, res) => {
  const newCategory = req.body;
  newCategory.id = categories.length + 1;
  categories.push(newCategory);
  fs.writeFileSync('./backend/data/categories.json', JSON.stringify(categories, null, 2));
  res.status(201).json(newCategory);
});

app.listen(port, () => {
  console.log(`Backend listening at http://localhost:${port}`);
});