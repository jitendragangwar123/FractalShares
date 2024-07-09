const connectDB = require("./db/connect");
const app = require(".");


const dotenv = require("dotenv");
dotenv.config();


const port = process.env.PORT || 8000;
const start = async () => {
 try {
   const res= await connectDB(process.env.DATABASE_URL);
   app.listen(port, () => {
     console.log(`Server is running on port ${port}`);
   });
 } catch (err) {
   console.log(err);
 }
};


start();
