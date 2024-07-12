const connectDB = require("./db/connect");
const app = require(".");
const dotenv = require("dotenv");
dotenv.config();

const port = process.env.PORT || 8000;
const start = async () => {
 try {
   const DATABASE_URL="mongodb+srv://jitendra123:jacob123@cluster0.di5hufc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
   const res= await connectDB(DATABASE_URL);
   app.listen(port, () => {
     console.log(`Server is running on port ${port}`);
   });
 } catch (err) {
   console.log(err);
 }
};


start();
