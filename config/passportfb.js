
const passport = require('passport')
const passportfb = require('passport-facebook').Strategy
const { User } = require('../models/user');

passport.serializeUser((user, done) => {
    console.log('Serialize passport Fb: ', user)
    done(null, user.id)
})

passport.deserializeUser((fbid, done) => {
    User.findOne({fbid}, (err, user) => {
        if(err) return console.log(err)
        done(null, user);
    })
})

passport.use(new passportfb({
    clientID: '394814394294763',
    clientSecret: 'bdd916fac40827aaaae4cf18ebb30551',
    callbackURL: 'http://localhost:3000/auth/fb/cb',
    profileFields: ['id', 'displayName', 'photos', 'email']
}, (accessToken, refeshToken, profile, done) => {
    //console.log(profile);
    const {id, name, email} = profile._json;
    User.findOne({fbid: id}, (err, user) =>{
        if(err) return done(err);
        if(user) return done(null, user);
        const newUser = new User({
            fbid: id,
            name,
            email
        })
        
        newUser.save((err, user) => {
            if(err) return done(err);
            done(null, newUser)
        })

    })

   

}))

