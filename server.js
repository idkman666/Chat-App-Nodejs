var _express = require("express")
var bodyParser =require('body-parser')
var app = _express()
var http = require('http').Server(app)
var io = require ('socket.io')(http)
var mongoose = require ('mongoose')

mongoose.Promise = Promise;

app.use(_express.static(__dirname))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

var dbUrl = "your mongo dib url goes here"

var Message = mongoose.model('Message', {
    name: String,
    message: String
})


app.get('/messages', (req, res)=>
{
    Message.find({}, (err,messages)=>
    {
        res.send(messages)
    })
    
})

app.post('/messages', async(req, res) => {
    var message = new Message(req.body)
    message.save().then(() => {
                
        io.emit('message', req.body)
        
        res.sendStatus(200)
    }).then()
    .catch((err)=>{
        res.sendStatus(500)
        return console.err(err)
    })

})

io.on('connection', (socket) =>{
    console.log('a user is connected')
})


mongoose.connect(dbUrl, { useUnifiedTopology: true, useNewUrlParser: true }  ,(err)=>{
    console.log('mongo db connection', err);
})

var server = http.listen(3000, ()=> 
{
    console.log("listening on the port")
})
