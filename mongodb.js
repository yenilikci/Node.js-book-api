const express = require('express')
const MongoClient = require('mongodb').MongoClient
//swagger
const swaggerJSDoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')

const app = express()

app.use(express.json())
var database

//swagger options
const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Node JS Api Project for mongodb',
            version: '1.0.0'
        },
        servers: [
            {
                url:'https://localhost:8080/'
            }
        ]
    },
    apis: ['./mongodb.js']
}
//middleware setup
const swaggerSpec = swaggerJSDoc(options)
app.use('/api-docs',swaggerUi.serve,swaggerUi.setup(swaggerSpec))

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

//id'ye göre veri güncelle
app.put('/api/books/:id',(req,res) => {
    let query = {id:parseInt(req.params.id)}
    let book = {
        id: parseInt(req.params.id),
        title: req.body.title
    }
    let dataSet = {
        $set:book
    }
    database.collection('books').updateOne(query,dataSet,(err,result) => {
        if(err) throw err
        res.send(book)
    })
})

//id'ye göre kitap sil
app.delete('/api/books/:id',(req,res) => {
    database.collection('books').deleteOne({id:parseInt(req.params.id)}, (err,result) =>{
        if(err) throw err
        res.send('book is deleted')
    })
})

app.listen(8080, () => {
    MongoClient.connect('mongodb://localhost:27017', {useNewUrlParser:true},(error,result) => {
        if(error) throw error
        database = result.db('testDB')
        console.log('connection succesful')
    })
})