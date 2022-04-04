const { User } = require("../models/User");

let auth= (req, res, next) => {

    //인증처리

    // client cookie에서 get token
    let uToken = req.cookies.x_auth;

    // token decode 후 find userID
    User.findByToken( uToken, (err, user) => {
        if(err) throw err;
        if(!user) return res.json ({ isAuth: false, error: true})

        req.uToken = uToken;
        req.user = user;
        next();
    })

    // if user -> auth 허용

    // if !user -> auth 거절


}

module.exports = { auth };