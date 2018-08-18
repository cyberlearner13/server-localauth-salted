const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bcrypt = require('bcrypt-nodejs');

const userSchema = new Schema({
  email : {
    type:String,
    unique: true,
    lowercase: true
  },
  password: String
});

//On save Hook, encrypt password
userSchema.pre('save',function(next) {
  const user = this;

  //generate a salt (assault lmao) and then run!! (callback lol)
  bcrypt.genSalt(10,function(err,salt) {
      if(err){
        return next(err);
      }

      //hash our password using the salt, then run callback
      bcrypt.hash(user.password, salt, null, function(err, hash) {
        if(err){
          return next(err);
        }

        //overwrite plain text password with hash(encrypted password)
        user.password = hash;
        next();
      });
  });

});

userSchema.methods.comparePassword = function(candidatePassword, callback){
  bcrypt.compare(candidatePassword, this.password, function(err,isMatch) {
    if (err ){
      return callback(err);
    }
    callback(null, isMatch);
  })
}

module.exports = mongoose.model('user',userSchema);
