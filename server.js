const express = require('express');
const bodyParser = require('body-parser')
const MongoClient =require('mongodb').MongoClient
const app = express();
const PORT = 3000;

const connectionString = 'mongodb+srv://admin:admin@Cluster0.bygkd.mongodb.net/?retryWrites=true&w=majority'

MongoClient.connect(process.env.MONGODB_URI || connectionString,  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },)
    .then(client => {
        console.log('Connected to Database')

        const db = client.db('star-war-quotes')
        const quotesCollection = db.collection('quotes')

        app.listen(process.env.PORT || PORT, function() {console.log('listening on 3000')})    

        app.set('view engine', 'ejs')

        app.use(express.static('public'))

        app.use(bodyParser.json())

        app.use(bodyParser.urlencoded({extended: true}))

        app.get('/', (req, res) => {
            db.collection('quotes').find().toArray()
                .then(results => {

                    res.render('index.ejs', { quotes : results })

                })
                .catch(error => console.error(error))
                        
        })

        app.post('/quotes', (req, res) => {
            quotesCollection.insertOne(req)
                .then(result => {
                    console.log(result)
                    res.redirect('/')
                })
                .catch(error => console.error(error))
        })

        app.put('/quotes', (req,res) => {
            quotesCollection.findOneAndUpdate(
                {name: 'Yoda'},
                {
                    $set: {
                        name: req.body.name,
                        quote: req.body.quote
                    }
                },
                {
                    upsert: true
                }
            )
            .then(result =>{ res.json('Success')})
            .catch(error => console.error(error))
        })

        app.delete('/quotes', (req,res) =>{
            quotesCollection.deleteOne(
                { name: req.body.name }
            )
            .then(result => {
                if (result.deletedCount === 0){
                    return res.json('No quote to delete')
                }
                res.json("Deleted Darth Vadar's quote")
            })
            .catch(error => console.error(error))
        })

    })
    .catch(error => console.error(error))

