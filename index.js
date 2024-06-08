const express = require("express");
const dotenv = require("dotenv");
const app = express();
const PORT = 8000;
dotenv.config();


const userRouter = require("./routes/userRoutes");
const adminRouter = require("./routes/adminRoutes");
const movieRouter = require('./routes/movieRoutes')


const { sequelize, connectDB } = require("./config/db");
connectDB();

app.use(express.json());


app.use("/api/user", userRouter);
app.use("/api/admin", adminRouter);
app.use("/api/movie",movieRouter)



app.listen(PORT, () => {
  console.log("Server is running at 8000");
});
