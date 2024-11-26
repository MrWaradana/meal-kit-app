import dotenv from "dotenv"
dotenv.config();
import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import bodyParser from "body-parser"
import router from "./routes/router.mjs";
const prefix = "/api/v1";

const app = express();
app.use(express.json());
app.use((req, res, next) => {
    res.setHeader('Content-Type', 'application/json');
    next();
});
app.use(cors());
app.use(cookieParser());
app.use(bodyParser.json());

app.use(prefix, router);

app.listen(process.env.PORT, () => {
    console.log(`Server is running on http://localhost:${process.env.PORT}`);
});