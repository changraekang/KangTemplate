const express  = require('express')
const mongoose  = require("mongoose");
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const app      = express()
const port     = 5000

const config = require('./config/key');

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
const { User } = require('./models/User');

 mongoose
   .connect(config.MongoURI, {
     useNewUrlParser: true,
     useUnifiedTopology: true,
   })
   .then(() => console.log("mongoDB Connected"))
   .catch((err) => console.log(err));


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
 app.post('/login', (req, res) => {

    //요청된 email을 DB에서 조회한다
    User.findOne({ uEmail: req.body.uEmail} , (err,user) => {
      if(!user) {
        return res.json({
          loginSuccess: false,
          message: "해당하는 회원이 존재하지 않습니다." 
        })
      }
      //요청된 email이 조회된다면 비밀번호와 매칭
      user.comparePassword(req.body.uPassword, (err, isMatch) => {
        if (!isMatch) {
          return res.json({
            loginSuccess: false,
            message: "비밀번호가 틀렸습니다",
          });
        }
        //비밀번호가 일치한다면 token생성
        user.generateToken((err, user) => {
          if (err) return res.status(400).send(err);
          // 토큰을 저장한다. 어디에?
          res
            .cookie("x_auth", user.token)
            .status(200)
            .json({ loginSuccess: true, userId: user._id });
        });
      });

    })



   
 })


 app.listen(port, ()=> console.log(`Example app listening on port ${port}!`))