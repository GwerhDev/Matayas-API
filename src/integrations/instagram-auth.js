const Instagram = require('passport-instagram').Strategy;
const { instagramClientId, instagramClientSecret, instagramAccessToken, clientUrl } = require('../config');
const redirectUri = clientUrl + '/admin/post-instagram/callback';

const instagram = new Instagram({
  clientID: instagramClientId,
  clientSecret: instagramClientSecret,
  callbackURL: redirectUri,
}, function (accessToken, refreshToken, profile, done) {
  process.nextTick(async function () {
    try {
      console.log(profile)
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  });
});

module.exports = {
  instagram
};