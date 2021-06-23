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

app.listen(8080)