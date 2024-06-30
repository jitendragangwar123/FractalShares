const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const assetRouter = require("./routes/assetRoute");
const cors = require("cors");
const app = express();

// app.use(cors({
//     origin: [""],
//     methods: ["POST", "GET"],
//     Credential: true
// }))

app.use(express.json());
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(cors());

app.use('/api/v1/', assetRouter);

module.exports = app;
