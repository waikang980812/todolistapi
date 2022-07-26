require('dotenv').config()
const router = require("express").Router();
const passport = require("passport");
const CLIENT_HOME_PAGE_URL = process.env.CLIENT_HOME_PAGE_URL;



// when login is successful, retrieve user info
router.get("/login/success", (req, res) => {
    if (req.user) {
      res.json({
        success: true,
        message: "user has successfully authenticated",
        user: req.user,
        cookies: req.cookies
      });
    }
  });
  
  // when login failed, send failed msg
  router.get("/login/failed", (req, res) => {
    res.status(401).json({
      success: false,
      message: "user failed to authenticate."
    });
  });
  
  // When logout, redirect to client
  router.get("/logout", (req, res) => {
    req.logout();
    res.redirect(CLIENT_HOME_PAGE_URL);
  });
  
  // auth with google
  router.get('/google',
  passport.authenticate('google', { scope: ['profile'] }));
  
  // redirect to home page after successfully login via twitter
  router.get(
    "/google/callback",
    passport.authenticate("google", {
      successRedirect: "/",
      failureRedirect: "/auth/login/failed"
    })
  );

  //for testing purpose to get current user data
  router.get("/currentUser", (req, res) => {
    res.send(req.user);
  });
  
  module.exports = router;
  