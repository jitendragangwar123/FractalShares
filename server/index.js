const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const assetRouter = require("./routes/assetRoute");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./db/connect");

dotenv.config();

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

const port = process.env.PORT || 8000;

const start = async () => {
    try {
        await connectDB(process.env.MONGODB_URI);
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    } catch (err) {
        console.log(err);
    }
};

start();
