const express = require("express");

const app = express();

app.use(express.json());

const books = [
  { title: "Java Programming", id: 1 },
  { title: "C# Programming", id: 2 },
  { title: "NodeJS Programming", id: 3 },
];

app.get("/", (req, res) => {
  res.send("REST API with Node JS");
});

app.get("/api/books", (req, res) => {
  res.send(books);
});

app.get("/api/books/:id", (req, res) => {
  const book = books.find((b) => b.id == parseInt(req.params.id));
  if (!book) res.status(404).send("books not found");
  res.status(200).send(book);
});

app.post("/api/books/addBook", (req, res) => {
  const book = {
    id: books.length + 1,
    title: req.body.title,
  };
  books.push(book);
  res.status(201).send(book);
});

app.put("/api/books/:id", (req, res) => {
  const book = books.find((b) => b.id == parseInt(req.params.id));
  if (!book) res.status(404).send("books not found");
  book.title = req.body.title;
  res.status(200).send(book);
});

app.delete("/api/books/:id", (req, res) => {
  const book = books.find((b) => b.id == parseInt(req.params.id));
  if (!book) res.status(404).send("books not found");
  const index = books.indexOf(books);
  books.splice(index, 1);
  res.status(200).send(book)
});

app.listen(8080);
