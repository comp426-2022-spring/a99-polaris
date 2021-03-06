const express = require("express");
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");

const dotEnv = require("dotenv");
dotEnv.config({ path: "./config.env" });

const apiLogger = require("./apiLogger")

const issueRoutes = require("./routes/issue")
const userRoutes = require("./routes/user")
const buildingRoutes = require("./routes/building")
const apiLogRoutes = require("./routes/apiLog")
const clientLogRoutes = require("./routes/clientLog")

const port = process.env.PORT || 5001;
const app = express();
const HTTP_STATUS_OK = 200;
const HTTP_STATUS_NOT_FOUND = 404;

app.use(
  bodyParser.urlencoded({
      extended: false,
  }),
);
app.use(express.json());
app.use(cors());


// Static directory path
// app.use(express.static(path.join(__dirname, 'dist/polaris'))) // TODO: fix

//// API routes
// Root endpoint
app.get("/app/", (req, res, next) => {
  res.json({"message":"Your API works! (200)"});
  res.status(HTTP_STATUS_OK);
});

// Logger
app.use(apiLogger);

// Routes
app.use(issueRoutes);
app.use(userRoutes);
app.use(buildingRoutes);
app.use(apiLogRoutes);
app.use(clientLogRoutes);

// app.get('*', (req, res) => {
//   res.sendFile(
//       path.join(__dirname, 'dist/polaris/index.html'),
//   )
// })

//// Default response for any request not addressed by the defined endpoints ////
app.use(function (req, res, next) {
  res.json({ "message": "Endpoint not found. (404)" });
  res.status(HTTP_STATUS_NOT_FOUND);
});

// error handler
app.use(function (err, req, res, next) {
  console.error(err.message)
  if (!err.statusCode) err.statusCode = 500
  res.status(err.statusCode).send(err.message)
})

// exit
process.on('SIGINT', () => {
  server.close();
});

const server = app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});