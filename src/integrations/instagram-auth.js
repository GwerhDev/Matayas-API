const Instagram = require('passport-instagram').Strategy;
const { instagramClientId, instagramClientSecret, clientUrl } = require('../config');
const redirectUri = clientUrl + '/admin/post-instagram/callback';

const instagram = new Instagram({
  clientID: instagramClientId,
  clientSecret: instagramClientSecret,
  callbackURL: redirectUri,
}, function (accessToken, refreshToken, profile, done) {
  process.nextTick(function () {
    try {
      return done(null, profile);
    } catch (error) {
      return done(error);
    }
  });
});

module.exports = {
  instagram
};