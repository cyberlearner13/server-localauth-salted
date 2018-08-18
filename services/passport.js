const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const User = require("../models/user");
const config = require("../config");
const LocalStrategy = require("passport-local");

//Setup options for local strategy
const localOptions = { usernameField: "email" };

//Create local strategy
const localLogin = new LocalStrategy(localOptions, function(email,password,done)
 {
  // Verify this email and password, call done with user
  //if it is the correct email
  //otherwise call done with false
  User.findOne({ email: email }, function(err, user) {
    if (err) {
      return done(err);
    }
    if (!user) {
      return done(null, false);
    }
    //compare passwords - is 'password' equal to user.password
    user.comparePassword(password, function(err, isMatch) {
      if(err){ return done(err); }
      if(!isMatch){ return done(null, false);}

      return done(null, user);
    });

  });
});

//Setup options for JWT Strategy
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader("authorization"),
  secretOrKey: config.secret
};

//Create JWT Strategy
const jwtLogin = new JwtStrategy(jwtOptions, function(payload, done) {
  //See if the user ID in the payload exits in our DB (  the payload is the decrypted user.id and timestamp)
  //If it does, call 'done' with that user
  //else: call 'done' without user
  User.findById(payload.sub, function(err, user) {
    if (err) {
      return done("err", false); //Could even conduct a search
    }
    if (user) {
      done(null, user); //Did a search, and found a user
    } else {
      done(null, false); //Did a search, could not find a user
    }
  });
});
// Tell passport to use this strategy
passport.use(jwtLogin);
passport.use(localLogin);
