const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        trim: true,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    }

})

userSchema.methods.setEmail = function(email) {
    console.log(this);
    this.email = email;
}

var User = mongoose.model('User', userSchema);
var user = new User({ name: 'Teo' });
user.setEmail('teo96@gmail.com');

console.log('Print user: ', user);


