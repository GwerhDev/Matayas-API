const GoogleStrategy = require("passport-google-oauth20").Strategy;
const { authClientId, authClientSecret, apiUrl } = require("../config");

const googleScope = [
  'email',
  'profile',
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/userinfo.profile',
  'https://www.googleapis.com/auth/plus.me'
];

const buildGoogleProfile = (accessToken, profile) => ({
  username: profile.name.givenName,
  email: profile.emails[0].value,
  photo: profile.photos[0].value,
  accessToken: accessToken,
  displayName: profile.displayName,
  googleId: profile.id,
});

const loginGoogle = new GoogleStrategy(
  {
    clientID: authClientId,
    clientSecret: authClientSecret,
    callbackURL: `${apiUrl}/login-google/callback`,
    scope: [
      'email',
      'profile',
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/plus.me'
    ],
    accessType: 'offline'
  }, function (accessToken, refreshToken, profile, done) {
    process.nextTick(async function () {
      try {
        const userData = {
          username: profile.name.givenName,
          email: profile.emails[0].value,
          photo: profile.photos[0].value,
          accessToken: accessToken,
          displayName: profile.displayName,
          googleId: profile.id,
        }
        return done(null, userData);
      } catch (err) {
        return done(err);
      }
    });
});

const signupGoogle = new GoogleStrategy({
  clientID: authClientId,
  clientSecret: authClientSecret,
  callbackURL: `${apiUrl}/signup-google/callback`,
  scope: [
    'email',
    'profile',
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/plus.me'
  ],
  accessType: 'offline'
  }, function (accessToken, refreshToken, profile, done) {
  process.nextTick(async function () {
    try {
      const userData = {
        username: profile.name.givenName,
        email: profile.emails[0].value,
        photo: profile.photos[0].value,
        accessToken: accessToken,
        displayName: profile.displayName,
        googleId: profile.id,
      }
      return done(null, userData);
    } catch (err) {
      return done(err);
    }
  });
});

// Vincular Google a una cuenta ya existente y autenticada.
// El id del usuario viaja en el `state` (JWT corto) que valida el callback.
const linkGoogle = new GoogleStrategy({
  clientID: authClientId,
  clientSecret: authClientSecret,
  callbackURL: `${apiUrl}/account/link-google/callback`,
  scope: googleScope,
  accessType: 'offline',
  }, function (accessToken, refreshToken, profile, done) {
  process.nextTick(function () {
    try {
      return done(null, buildGoogleProfile(accessToken, profile));
    } catch (err) {
      return done(err);
    }
  });
});

module.exports = {
  loginGoogle,
  signupGoogle,
  linkGoogle,
};