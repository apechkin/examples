module.exports = function(app) {

  var express = require('express');
  var router = express.Router();
  var controllers = require('../controllers')(app);
  var passport = require('passport');

  router.post('/', controllers.users.postLogin);

  // facebook
  router.get('/facebook', passport.authenticate('facebook'));
  router.get('/facebook/callback', passport.authenticate('facebook', {
    successRedirect: '/',
    failureRedirect: '/login',
    session: false
  }));

  // twitter
  router.get('/twitter', passport.authenticate('twitter'));
  router.get('/twitter/calllback', passport.authenticate('twitter', {
    successRedirect: '/',
    failureRedirect: '/login',
    session: false
  }));

  // google
  router.get('/google',
  passport.authenticate('google', {scope: ['https://www.googleapis.com/auth/plus.login']}));

  router.get('/google/callback', passport.authenticate('google', {
    successRedirect: '/',
    failureRedirect: '/login',
    session: false
  }));

  // linkedin
  router.get('/linkedin', passport.authenticate('linkedin'));
  router.get('/linkedin/calllback', passport.authenticate('linkedin', {
    successRedirect: '/',
    failureRedirect: '/login',
    session: false
  }));

  return router;

};
