const app = require("express")();
const { json } = require("body-parser");

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