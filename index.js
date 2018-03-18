const express = require('express');
const app = express();
const mongoose = require('mongoose');
require('./config/db')
const bParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const mongoDBStore = require('connect-mongo')(session);
const logger = require('morgan');
const path = require('path');
const fs = require('fs');
var accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a', encoding: null });
var passport = require('passport');
const {config} = require('./config/config')
//express setting
app.set('views', './views');
app.set('view engine', 'ejs')
//middleware
app.use(logger('dev', { stream: accessLogStream }));
app.use(bParser.json())
app.use(bParser.urlencoded({ extended: true })) // req.body object contains string, array or any type
app.use(express.static(__dirname + 'public'))
//app.use(cookieParser('thisIsSecret'));
app.use(session({
    name: 'connect.sid.duy',
    secret: config.secret,
    saveUninitialized: false, // don't create session until something store // default true: luu session du chua tao bien session
    resave: false, // don't save session if unmodifiled
    store: new mongoDBStore({
        mongooseConnection: mongoose.connection,
        touchAfter: 60 * 60 * 24
    }),
    cookie: { 
        maxAge: 15 * 60 * 1000
     }
}))
//passport
require('./config/passport');
require('./config/passportfb')
app.use(passport.initialize());
app.use(passport.session());

//routes
const {ctrlRegister, ctrlAddUser, ctrlLogin, isloggedIn} = require('./controllers/auth')
app.get('/', isloggedIn, (req, res, next) => {
    console.log(req.user);
    
    if (!req.session.count) {
        req.session.count = 1;
        return res.render('home', { 
            varSession: req.session.count,
            user: req.user
         });
    } else {
        req.session.count++;
    }
    res.render('home', { 
        varSession: req.session.count,
        user: req.user
     });
    // res.render('home', {varSession: 1})

})
//

app
    .get('/error', (req, res, next) => res.render('error'))
    .get('/register', ctrlRegister)
    .post('/register', ctrlAddUser)
    .get('/login', (req, res, next) => res.render('login'))
    .post('/login', passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/error'
    }))

app
    .get('/auth/fb', passport.authenticate('facebook', {scope: ['email']}))
    .get('/auth/fb/cb', passport.authenticate('facebook', {
        successRedirect: '/',
        failureRedirect: '/error'
    }))
    // .get('/auth/fb/cb', (req, res) => {
    //     passport.authenticate('facebook', (err, user, message) => {
    //         if(err) return console.log(err)
    //         if(user) res.redirect('/')
    //     })(req, res)
    // })

app.get('/logout', (req, res, next) => {
    req.logout();
    req.session.destroy();
    res.redirect('/login')
})

app.use((err, req, res, next) => {
    res.status(404);
    res.json({
        message: err
    })
})
app.listen(3000, (err) => {
    if (err) console.log('Server error: ', err);
    console.log('Server started.');
})