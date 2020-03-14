/**
 * The Express server object.
 * 
 * @const
 */
const { server } = require("./server");

/**
 * The port number the server will listen on.
 * 
 * @const
 */
const port = 8080;
server.listen(port, () => {
  console.log("Listening on port " + port);
});
