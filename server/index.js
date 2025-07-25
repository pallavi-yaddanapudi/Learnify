import express from "express";
import dotenv from "dotenv";
import connectDb from "./database/db.js";
import userRoute from "./routes/user.js";
import courseRoute from "./routes/course.js";
import cookieParser from "cookie-parser";
import cors from "cors";

dotenv.config({});

connectDb();

const app = express();

const PORT =process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}));

// console.log("userRoute is: ", userRoute);
app.use("/api/user",userRoute);
app.use("/api/course",courseRoute);


app.get("/home",(req,res) => {
    res.status(200).json({
        success:true,
        message:"I am from backend"
    })
});

app.listen(PORT,() => {
    console.log(`server listen at port ${PORT}`);
});

