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
                url:'http://localhost:8080/'
            }
        ]
    },
    apis: ['./mongodb.js']
}
//middleware setup
const swaggerSpec = swaggerJSDoc(options)
app.use('/api-docs',swaggerUi.serve,swaggerUi.setup(swaggerSpec))


/** 
*   @swagger
*   /:
*    get:
*        summary: AA this api is used to check if get method is working or not
*        description: this api is used to check if get method is working or not
*        responses:
*            200:
*                description: To test Get method
*/
app.get('/',(req,res) => {
    res.send('welcome to mongodb api')
})

/**
 * @swagger
 *  components:
 *      schemas:
 *              Book:
 *                  type: object
 *                  properties:
 *                      id:
 *                          type: integer
 *                      title:
 *                          type: string
*/
/** 
*   @swagger
*   /api/books:
*    get:
*        summary: to get all books from mongodb
*        description: this api is used to fetch data from mongodb
*        responses:
*           200:
*               description: this api used to fetch data from mongodb
*               content:
*                   application/json:
*                       schema:
*                           type: array     
*                       items:
*                           $ref: '#components/schemas/Book'                  
*/
//tüm verileri getir
app.get('/api/books',(req,res) => {
    database.collection('books').find({}).toArray((err,result) => {
        if(err) throw err
        res.send(result)
    })
})
/** 
*   @swagger
*   /api/books/{id}:
*    get:
*        summary: to get all books from mongodb
*        description: this api is used to fetch data from mongodb
*        parameters:
*           - in: path
*             name: id
*             required: true
*             description: Numeric Id required
*             schema:
*               type: integer
*        responses:
*           200:
*               description: this api used to fetch data from mongodb
*               content:
*                   application/json:
*                       schema:
*                           type: array
*                       items:
*                           $ref: '#components/schemas/Book'
*/
//id'ye göre veri getir
app.get('/api/books/:id',(req,res) => {
    database.collection('books').find({id:parseInt(req.params.id)}).toArray((err,result) => {
        if(err) throw err
        res.send(result)
    })
})
/** 
*   @swagger
*   /api/books/addBook:
*    post:
*        summary: used to insert data to mongodb
*        description: this api is used to fetch data from mongodb
*        requestBody:
*           required: true
*           content: 
*               application/json:
*                   schema:
*                      $ref: '#components/schemas/Book'
*        responses:
*           200:
*               description: Added succesfully
*/
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
/** 
*   @swagger
*   /api/books/{id}:
*    put:
*        summary: used to update data to mongodb
*        description: this api is used to fetch data from mongodb
*        parameters:
*           - in: path
*             name: id
*             required: true
*             description: Numeric Id required
*             schema:
*               type: integer
*        requestBody:
*           required: true
*           content: 
*               application/json:
*                   schema:
*                      $ref: '#components/schemas/Book'
*        responses:
*           200:
*               description: Updated succesfully
*               content:
*                   application/json:
*                       schema:
*                           type: array
*                       items:
*                           $ref: '#components/schemas/Book'
*/
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
/** 
*   @swagger
*   /api/books/{id}:
*    delete:
*        summary: this api is use to delete record from mongodb database
*        description: this api is used to fetch data from mongodb
*        parameters:
*           - in: path
*             name: id
*             required: true
*             description: Numeric Id required
*             schema:
*               type: integer
*        responses:
*           200:
*               description: data is deleted
*/
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