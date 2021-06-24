const express = require('express')
const MongoClient = require('mongodb').MongoClient

const app = express()

app.use(express.json())
var database

app.get('/',(req,res) => {
    res.send('welcome to mongodb api')
})

//tüm verileri getir
app.get('/api/books',(req,res) => {
    database.collection('books').find({}).toArray((err,result) => {
        if(err) throw err
        res.send(result)
    })
})

//id'ye göre veri getir
app.get('/api/books/:id',(req,res) => {
    database.collection('books').find({id:parseInt(req.params.id)}).toArray((err,result) => {
        if(err) throw err
        res.send(result)
    })
})

//veri ekle
app.post('/api/books/addBook',(req,res)=>{
    let resp = database.collection('books').find({}).sort({id:-1}).limit(1)
    resp.forEach(obj => {
        if(obj){
            let book = {
                id:obj.id+1,
                title:req.body.title
            }
            database.collection('books').insertOne(book,(err,result) => {
                if(err) res.status(500).send(err)
                res.send('Added succesful')
            })
        }
    })
})

app.listen(8080, () => {
    MongoClient.connect('mongodb://localhost:27017', {useNewUrlParser:true},(error,result) => {
        if(error) throw error
        database = result.db('testDB')
        console.log('connection succesful')
    })
})