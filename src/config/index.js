const { production } = require("../misc/consts");

const isProd = process.env.NODE_ENV === production;

// Acepta JSON (["a@x.com","b@y.com"]) o lista coma-separada.
const parseEmailList = (raw) => {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed.map((e) => String(e).trim().toLowerCase());
  } catch (_) { /* no era JSON, se trata como coma-separado */ }
  return raw.split(",").map((e) => e.trim().toLowerCase()).filter(Boolean);
};

// Lista blanca de orígenes permitidos para CORS.
// En producción DEBE definirse CORS_ORIGINS (coma-separado); si no, se cae a
// los dominios conocidos del sitio. En desarrollo se permite el cliente local.
const corsOrigins = (process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(",")
  : [
      process.env.CLIENT_URL,
      process.env.CLIENT_URL_PROD,
      !isProd && "http://localhost:5173",
      isProd && "https://amplificadoresmatayas.com",
      isProd && "https://www.amplificadoresmatayas.com",
    ])
  .map((o) => o && o.trim())
  .filter(Boolean);

module.exports = {
  port: process.env.PORT || 8080,
  environment: process.env.NODE_ENV,
  isProd,
  apiUrl: isProd ? process.env.API_URL_PROD : process.env.API_URL,
  clientUrl: isProd ? process.env.CLIENT_URL_PROD : process.env.CLIENT_URL,

  corsOrigins,
  bodyLimit: process.env.BODY_LIMIT || "25mb",

  adminEmailList: process.env.ADMIN_EMAIL_LIST,
  adminEmails: parseEmailList(process.env.ADMIN_EMAIL_LIST),

  privateSecret: process.env.PRIVATE_SECRET,
  defaultPassword: process.env.DEFAULT_PASSWORD,
  defaultUsername: process.env.DEFAULT_USERNAME,

  mongodbString: process.env.MONGODB_STRING,

  sendgridApiKey: process.env.SENDGRID_API_KEY,
  sendgridSenderEmail: process.env.SENDGRID_SENDER_EMAIL,
  sendgridTemplateContactMessage: process.env.SENDGRID_TEMPLATE_CONTACT_MESSAGE,
  sendgridTemplateMailVerification: process.env.SENDGRID_TEMPLATE_MAIL_VERIFICATION,
  sendgridTemplatePasswordReset: process.env.SENDGRID_TEMPLATE_PASSWORD_RESET,

  passwordResetTokenMinutes: Number(process.env.PASSWORD_RESET_TOKEN_MINUTES) || 30,

  authClientId: process.env.AUTH_CLIENT_ID,
  authClientSecret: process.env.AUTH_CLIENT_SECRET,

  instagramUserId: process.env.INSTAGRAM_USER_ID,
  instagramClientId: process.env.INSTAGRAM_CLIENT_ID,
  instagramClientSecret: process.env.INSTAGRAM_CLIENT_SECRET,
  instagramAccessToken: process.env.INSTAGRAM_ACCESS_TOKEN,
};
