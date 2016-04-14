module.exports = function(models, nconfig) {

  var passport = require('passport');
  var LocalStrategy = require('passport-local').Strategy;
  var BearerStrategy = require('passport-http-bearer').Strategy;
  var FacebookStrategy = require('passport-facebook').Strategy;
  var TwitterStrategy  = require('passport-twitter').Strategy;
  var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
  var LinkedInStrategy = require('passport-linkedin').Strategy;
  var Errors = require('./errors');
  var facebookAuth = nconfig.get('facebook');
  var twitterAuth = nconfig.get('twitter');
  var googleAuth = nconfig.get('google');
  var linkedinAuth = nconfig.get('linkedin');

  function authUser(condition, token, userId, done) {
    models.User.findOne(condition).then(function(user) {
      if (!user) {
        models.User.create({facebook_id: userId})
        .then(function(createdUser) {
          models.Token.create({userId: createdUser.user_id, accessToken: token})
          .then(function(token) {
            done(null, token);
          })
          .catch(function(err) {
            done(err);
          });
        })
        .catch(function(err) {
          done(err);
        });
      } else {
        var tokenCondition = {
          where: {
            userId: user.user_id
          }
        };
        models.Token.findOne(tokenCondition)
        .then(function(token) {
          if (!token) {
            models.Token.create({userId: user.user_id, accessToken: accesToken})
            .then(function(createdToken) {
              done(null, createdToken);
            })
            .catch(function(err) {
              done(err);
            });
          } else {
            done(null, token);
          }
        })
        .catch(function(err) {
          done(err);
        });
      }
    })
    .catch(function(err) {
      done(err);
    });
  };

  passport.use(new LocalStrategy({
      usernameField: 'email',
      passwordField: 'password',
      session: false
    },
    function(email, password, done) {
      var condition = {
        where: {
          email: email
        }
      };
      models.User.findOne(condition).then(function(user) {
        if (!user) {
          return done(new Errors.NotFound('User not found'));
        }

        if (user.verifyPassword(password) === false) {
          return done(new Errors.Unauthorized('Incorrect password.'));
        }

        models.Token.create({userId: user.user_id}).then(function(token) {
          return done(null, token);
        });

      }).catch(function(err) {
        done(err);
      });
    }
  ));

  passport.use(new FacebookStrategy({
    clientID: facebookAuth.clientID,
    clientSecret: facebookAuth.clientSecret,
    callbackURL: facebookAuth.callbackURL
  },
  function(accesToken, refreshToken, profile, done) {
    var condition = {
      where: {
        facebook_id: profile.id
      }
    };
    authUser(condition, accesToken, profile.id, done);
  }));

  passport.use(new TwitterStrategy({
    clientID: twitterAuth.clientID,
    clientSecret: twitterAuth.clientSecret,
    callbackURL: twitterAuth.callbackURL
  },
  function(accesToken, refreshToken, profile, done) {
    var condition = {
      where: {
        twitter_id: profile.id
      }
    };
    authUser(condition, accesToken, profile.id, done);
  }));

  passport.use(new GoogleStrategy({
    clientID: googleAuth.clientID,
    clientSecret: googleAuth.clientSecret,
    callbackURL: googleAuth.callbackURL
  },
  function(accesToken, refreshToken, profile, done) {
    var condition = {
      where: {
        google_id: profile.id
      }
    };
    authUser(condition, accesToken, profile.id, done);
  }));

  passport.use(new LinkedInStrategy({
    clientID: linkedinAuth.clientID,
    clientSecret: linkedinAuth.clientSecret,
    callbackURL: linkedinAuth.callbackURL
  },
  function(accesToken, refreshToken, profile, done) {
    var condition = {
      where: {
        linkedin_id: profile.id
      }
    };
    authUser(condition, accesToken, profile.id, done);
  }));

  passport.use(new BearerStrategy(
    function(token, done) {
      var condition = {
        where: {
          accessToken: token
        }
      };
      models.Token.findOne(condition).then(function(token) {
        if (!token) {
          return done(new Errors.Unauthorized('Bad token'));
        }

        token.getUser().then(function(user) {
          if (!user) {
            return done(new Errors.Internal());
          }

          return done(null, user);
        });
      })
      .catch(function(err) {
        done(err);
      });
    }
  ));

  return passport;
};
