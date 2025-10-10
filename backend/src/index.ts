import "./config/env";
import express, { Application } from "express";

import connectDB from "./config/db";
import cors from "cors";
import http from "http";
import cookieParser from "cookie-parser";

import {
  authRouter,
  usersRouter,
  postsRouter,
  commentsRouter,
  messagesRouter,
} from "./routes";

import { env } from "./config/env";
import { configureCors } from "./config/cors";
import { initializeSocket } from "./socket/socket";

const app: Application = express();
const server = http.createServer(app);
const corsOptions = configureCors();

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/assets", express.static("src/assets"));

app.use("/api/auth", authRouter);
app.use("/api/users", usersRouter);
app.use("/api/posts", postsRouter);
app.use("/api/comments", commentsRouter);
app.use("/api/messages", messagesRouter);

(async function startServer() {
  try {
    await connectDB();
    console.log("Connected to MongoDB");

    // Initialize Socket.IO
    initializeSocket(server);

    server.listen(Number(env.PORT), "0.0.0.0", () => {
      console.log(`Server running on on the  http://localhost:${env.PORT}/`);
      console.log(`WebSocket server ready`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
})();
