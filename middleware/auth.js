const { User } = require("../models/User");

let auth= (req, res, next) => {

    //인증처리

    // client cookie에서 get token
    let token = req.cookeis.x_auth;

    // token decode 후 find userID
    User.findByToken( token, (err, user) => {
        if(err) throw err;
        if(!user) return res.json ({ isAuth: false, error: true})

        req.token = token;
        req.user = user;
        next();
    })

    // if user -> auth 허용

    // if !user -> auth 거절


}

module.exports = { auth };