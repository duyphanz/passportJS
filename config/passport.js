
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const { User } = require('../models/user');



passport.serializeUser((user, done) => {
    console.log('Serialize passport: ')
    if(typeof user.name != 'string') return done(null, user.displayName)
    done(null, user.name)
})

passport.deserializeUser((name, done) => {
    console.log('Deserialize', name);
    User.findOne({ name: name})
    .then( user => {
        if(!user) return done(null, false)
        return done(null, user)
    })
    .catch( err => done(err))
})

passport.use(new LocalStrategy({
    usernameField: 'email',
},
    (username, password, done) => {
        console.log('Passport config');
        
        User.findOne({ email: username })
            .then(user => {
                if (!user) {
                    console.log('Passport error: Incorrect username');
                    return done(null, false, { message: 'Incorrect username' });
                }
                //console.log('Find User: ', user);
                
                if (!user.validPassword(password, user.salt, user.hash)) {
                    console.log('Passport error: Incorrect password');
                    return done(null, false, { message: 'Incorrect password' })}

                return done(null, user)
            })
            .catch(err => {
                console.log('Loi config passport: ', err);
                
                done(err)
            })
    }))
