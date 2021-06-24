const express = require('express')
const MongoClient = require('mongodb').MongoClient

const app = express()

app.use(express.json())
var database

app.get('/',(req,res) => {
    res.send('welcome to mongodb api')
})

app.get('/api/books',(req,res) => {
    database.collection('books').find({}).toArray((err,result) => {
        if(err) throw err
        res.send(result)
    })
})

app.listen(8080, () => {
    MongoClient.connect('mongodb://localhost:27017', {useNewUrlParser:true},(error,result) => {
        if(error) throw error
        database = result.db('testDB')
        console.log('connection succesful')
    })
})