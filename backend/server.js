import express from "express";
import cors from "cors";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";
import AuthRoutes from "./routes/authRoutes.js";
import KnowledgeBaseRouter from './routes/knowledgeBaseRoutes.js';
import mongoose from "mongoose";
dotenv.config();

const url = process.env.MONGO_DB_URI;
const port = process.env.PORT || 9000;
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/v1/auth", AuthRoutes);
app.use("/api/v1/auth", KnowledgeBaseRouter);

async function server() {
  console.log(port, url);
  app.listen(port);
  await mongoose
    .connect(url)
    .then(() => {
      console.log("Connetced to DB");
    })
    .catch((err) => {
      console.log(err);
    });
  return "done.";
}

server()
  .then(() => {
    console.log(`App is running on port ${process.env.PORT}`);
    console.log("Mongo is Connected");
  })
  .catch((err) => {
    console.log(err);
  });
