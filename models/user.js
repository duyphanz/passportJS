const mongoose = require('mongoose');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
    fbid: {
        type: String
    },
    email: {
        type: String,
        trim: true,
        //required: true,
        unique: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    salt: {
        type: String,
        //required: true
    },
    hash: {
        type: String,
        //required: true
    }
})

userSchema.methods.setPassword = function(password) {

    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, new Buffer(salt), 1000, 64, 'sha1').toString('hex');
    
}

userSchema.methods.validPassword = function(password) {
    // console.log('Password: ', password);
    // console.log('Salt validPassword', userSalt);
    const hash = crypto.pbkdf2Sync(password, new Buffer(this.salt), 1000, 64, 'sha1').toString('hex');
    // console.log('Hash value: ', hash);
    
    
    return hash == this.hash;
}

const User = mongoose.model('User', userSchema);

module.exports = { User };