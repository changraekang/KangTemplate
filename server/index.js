const express  = require('express')
const mongoose  = require("mongoose");
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const app      = express()
const port     = 5000

const config = require('./config/key');

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(cookieParser());

const { User } = require('./models/User');
const { auth } = require('./middleware/auth');

 mongoose
   .connect(config.MongoURI, {
     useNewUrlParser: true,
     useUnifiedTopology: true,
   })
   .then(() => console.log("mongoDB Connected"))
   .catch((err) => console.log(err));


 app.get('/',(req, res) => res.send('Hello World!!'))
 app.get('/api/hello',(req, res) =>{
     res.send('Hello World2')
    })


 app.post('/api/user/register', (req, res) => {

    const user = new User(req.body)
    user.save((err, userInfo) => {
        if(err) return res.json({ success: false, err})
        return res.status(200).json({
            success: true
        })
    })

 })
 app.post('/api/user/login', (req, res) => {

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
            .cookie("x_auth", user.uToken)
            .status(200)
            .json({ loginSuccess: true, userId: user._id });
        });
      });

    })
 })



 /**
  * role 1 admin, role 2 특정부서 admin
  * role 0 일반유저 role 0이 아니면 관리자
  */
app.get('/api/user/auth', auth , (req,res) => {

  // 여기까지 middleware를 통과한것은 인증을 한 ID

  res.status(200).json({
    _id: req.user._id,
    isAdmin: req.user.role === 0 ? false: true, // 정책에 따라 변경 가능
    isAuth: true,
    uEmail: req.user.uEmail,
    uName: req.user.uName,
    uRole: req.user.uRole,
    uImage: req.user.uImage



  })


})

app.get('/api/user/logout', auth, (req,res) => {

  User.findByIdAndUpdate({ _id: req.user._id},
    {uToken: ''},
    (err, user) => {
      if (err) return res.json({ success: false, err});
      return res.status(200).send({
        success: true
      })
    }
    )

})


 app.listen(port, ()=> console.log(`Example app listening on port ${port}!`))