const app = require("express")();
const { json } = require("body-parser");

app.use(json());
app.use("/generate-trip", require("./routes/generate-trip"));

module.exports = {
  server: app
};
  