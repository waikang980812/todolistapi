require('dotenv').config()
const passport = require("passport");
var GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require("../models/user");
const Role = require('../_helpers/role');

// serialize the user.id to save in the cookie session
// so the browser will remember the user when login
passport.serializeUser((user, done) => {
    done(null, user.id);
});


// deserialize the cookieUserId to user in the database
passport.deserializeUser((id, done) => {
    User.findById(id)
      .then(user => {
        done(null, user);
      })
      .catch(e => {
        done(new Error("Failed to deserialize an user"));
      });
  });

  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback"
  },
  async (accessToken, refreshToken, profile, cb) => {
    console.log(accessToken);
    const currentUser = await User.findOne({
        googleId: profile.id
    });
    if(!currentUser){
        const newUser = await new User({
            name: profile.displayName,
            screenName: profile.displayName,
            googleId: profile.id,
            role: Role.Admin
        }).save();
        if(newUser){
            cb(null,newUser)
        }
    }else{
      cb(null,currentUser);
    }
  }
));
