 const express  = require('express')
 const mongoose  = require("mongoose");
 const app      = express()
 const port     = 5000
 const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
const { User } = require('./models/User');

 mongoose.connect(
   "mongodb+srv://kangchangrae:l8IndR6tl0I5I24e@cluster0.2njz4.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
   {
     useNewUrlParser: true,
     useUnifiedTopology: true,
   }
 ).then(()=>console.log("mongoDB Connected")).catch( err => console.log(err))


 app.get('/',(req, res) => res.send('Hello World!!'))

 app.post('/register', (req, res) => {



    const user = new User(req.body)
    user.save((err, userInfo) => {
        if(err) return res.json({ success: false, err})
        return res.status(200).json({
            success: true
        })
    })

 })


 app.listen(port, ()=> console.log(`Example app listening on port ${port}!`))