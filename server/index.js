const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const assetRouter = require("./routes/assetRoute");
const cors = require("cors");
const app = express();

const corsOptions = {
    origin: '*', 
    methods: 'GET, POST, PUT, DELETE, OPTIONS', 
    allowedHeaders: 'Content-Type, Authorization', 
};

app.use(express.json());
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(cors(corsOptions));

app.use('/', assetRouter);

module.exports = app;
