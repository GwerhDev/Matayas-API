const express = require("express");
const server = express();
const routes = require("./routes");

const cors = require("cors");
const morgan = require("morgan");
const session = require("express-session");
const passport = require("passport");

const { privateSecret, corsOrigins, bodyLimit, isProd } = require("./config");

server.use(morgan(isProd ? "combined" : "dev"));

server.use(cors({
  origin: corsOrigins,
  methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept", "Authorization"],
  credentials: true,
}));

server.use(express.json({ limit: bodyLimit }));
server.use(express.urlencoded({ limit: bodyLimit, extended: true }));

server.use(session({
  secret: privateSecret,
  resave: false,
  saveUninitialized: false,
}));

server.use(passport.initialize());
server.use(passport.session());
server.use("/", routes);

module.exports = server;
