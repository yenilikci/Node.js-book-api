const express = require('express')

const app = express()

app.use(express.json())

const books = [
    {title:'Java Programming',id:1},
    {title:'C# Programming',id:2},
    {title:'NodeJS Programming',id:3}
]

app.get('/',(req,res) => {
    res.send('REST API with Node JS')
})

app.get('/api/books',(req,res) => {
    res.send(books)
})

app.get('/api/books/:id',(req,res) => {
    const book = books.find(b => b.id == parseInt(req.params.id))
    if(!book) res.status(404).send('books not found')
    res.status(200).send(book)
})

app.listen(8080)