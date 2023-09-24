import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import morgan from "morgan";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRoute from "./routes/authRoute.js";
import userRoute from "./routes/userRoute.js";
import doctorRoute from "./routes/doctorRoute.js";
import reviewRoute from "./routes/reviewRoute.js";
import path from "path";

const app = express();
const __dirname = path.dirname(new URL(import.meta.url).pathname);
const corsOption = {
    origin: true, // allow to server to accept request from different origin
}
app.get("/",(req,res)=>{
    res.send("Api is in working conditions")
})
dotenv.config();
connectDB();
app.use(express.json());
app.use(cookieParser())
app.use(morgan("dev"));
app.use(cors(corsOption));

app.use("/api/v1/auth", authRoute);
app.use("/api/v1/user", userRoute);
app.use("/api/v1/doctor", doctorRoute);
app.use("/api/v1/review", reviewRoute);

app.use(express.static(path.join(__dirname, "./client/dist")));
app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "./client/dist/index.html"));
});

const PORT = process.env.PORT || 7979;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
