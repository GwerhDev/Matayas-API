const Instagram = require('node-instagram').default;
const { instagramClientId, instagramClientSecret, instagramAccessToken } = require('../config');

const instagram = new Instagram({
  clientId: instagramClientId,
  clientSecret: instagramClientSecret,
  accessToken: instagramAccessToken
});

module.exports = {
  instagram
};