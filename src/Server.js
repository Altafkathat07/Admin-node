import dotenv from "dotenv";
import express, { urlencoded } from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import session from "express-session";
import multer from "multer";

import dbconnect from "./db/connection.db.js";

const app = express();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.use(upload.any());
app.use(express.static("public"));
app.use(express.json({ limit: "20kb" }));
app.use(express.urlencoded({ extended: true, limit: "20kb" }));
app.use(cookieParser());
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: true,
  })
);

dotenv.config();

// route import

import { router } from "./routes/user.routes.js";

app.use("/api/users", router);

dbconnect()
  .then(() => {
    const port = process.env.PORT;
    app.listen(port, () => {
      console.log("Database connected susseccfully");
    });
  })
  .catch((error) => {
    console.log(`ERROR : DB connection failed...`, error);
  });
