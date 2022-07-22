require('dotenv').config()
const mongoose = require("mongoose");
const express = require("express");
const app = express();
const passport = require("passport");
const passportSetup = require("./config/passport-setup");
const session = require("express-session");
const authRoutes = require("./routes/auth");
const todoitemRoutes = require("./routes/todoitem");
const userRoutes = require("./routes/user");
const cors = require("cors");
const cookieParser = require("cookie-parser"); // parse cookie header
const cookieSession = require("cookie-session");

// connect to database
mongoose.connect(process.env.DATABASE_URL,{useNewUrlParser: true})
const db = mongoose.connection
db.on('error',(error)=> console.error(error))
db.once('open',()=> console.error('Connected to database'))

app.use(
    cookieSession({
      name: "session",
      keys: [process.env.COOKIE_KEY],
      maxAge: 24 * 60 * 60 * 100
    })
  );

// parse cookies
app.use(cookieParser());

// initalize passport
app.use(passport.initialize());
// deserialize cookie from the browser
app.use(passport.session());

// set up cors to allow us to accept requests from our client
app.use(
    cors({
      origin: "http://localhost:3000", // allow to server to accept request from different origin
      methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
      credentials: true // allow session cookie from browser to pass through
    })
  );

// set up routes
app.use("/auth", authRoutes);

app.use("/todoitem",todoitemRoutes);

app.use('/user',userRoutes);


const authCheck = (req, res, next) => {
    if (!req.user) {
      res.status(401).json({
        authenticated: false,
        message: 'user has not been authenticated. <a href="/auth/google">click here to login</a> '
      });
      // res.redirect('/auth/google')
    } else {
      next();
    }
  };
  
  // if it's already login, send the profile response,
  // otherwise, send a 401 response that the user is not authenticated
  // authCheck before navigating to home page
  app.get("/", authCheck, (req, res) => {
    res.status(200).json({
      authenticated: true,
      message: "user successfully authenticated",
      user: req.user,
      cookies: req.cookies
    });
  });

// start server
app.listen(3000,() => console.log('server started'))