var { User } = require('../models/user')
const passport = require('passport');

const ctrlRegister = (req, res, next) => {
    res.render('register');
}

const ctrlAddUser = (req, res, next) => {
    const { name, email, password } = req.body;
    var user = new User({
        name,
        email
    });
    user.setPassword(password);
    // console.log('Set user', user);
    // res.send('User set')
    user.save()
        .then(user => {
            console.log('Add user successfull: ', user);
            res.send('User set');
        })
        .catch(err => {
            console.log('Add user error: ', err);
            res.send('Add user error: ', err)
        })
}

const ctrlLogin = (req, res, next) => {
    console.log('ctrlLogin');

    passport.authenticate('local', (err, user, message) => {
        if (err) {
            console.log('loi chung thuc: ', err);
            res.status(404);
            res.json({
                message: err
            })
            return
        }
        if (message) {
            console.log('Message: ', message);
            res.status(404);
            res.json({
                message: err
            })
            return
        }
        res.redirect('/');
    })(req, res);
}

function isloggedIn( req, res, next){
    if(req.isAuthenticated()){
        return next()
    }
    res.redirect('/login')
}

module.exports = { ctrlRegister, ctrlAddUser, ctrlLogin, isloggedIn }