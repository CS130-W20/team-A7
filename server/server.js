/**
 * express module
 * @const
 */
const app = require("express")();

/**
 * body-parser module for converting JSON request bodies to Javascript Objects.
 */
const { json } = require("body-parser");

/**
 * Middleware object that disables CORS requirements. Only to be used in development.
 * 
 * @param {Object} req The Request object.
 * @param {Object} res The Response object.
 * @param {function} next The next function in the middleware stack.
 */
const allowCrossDomain = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', "*");
  res.header('Access-Control-Allow-Headers', "*");
  next();
}

app.use(allowCrossDomain);
app.use(json());
app.use("/generate-trip", require("./routes/generate-trip"));

module.exports = {
  server: app
};