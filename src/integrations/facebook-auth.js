const FacebookStrategy = require("passport-facebook").Strategy;
const { authFacebookClientId, authFacebookClientSecret, apiUrl } = require("../config");

const loginFacebook = new FacebookStrategy({

  }, function (accessToken, refreshToken, profile, done) {
    process.nextTick(async function () {
      try {
        const userData = {

        }
        return done(null, userData);
      } catch (err) {
        return done(err);
      }
    });
});

const signupFacebook = new FacebookStrategy({
  }, function (accessToken, refreshToken, profile, done) {
  process.nextTick(async function () {
    try {
      const userData = {

      }
      return done(null, userData);
    } catch (err) {
      return done(err);
    }
  });
});

module.exports = {
  loginFacebook,
  signupFacebook
}