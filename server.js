import express from "express";
import LoggerService from "./services/logger-service.js";

const app = express();

app.use(express.static("public"));

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

app.get("/login", (req, res) => {
  const loginLogger = new LoggerService("login");
  loginLogger.logInfo("User logged in", { name: "ali" });
  res.send("Hello from login path!");
});

app.get("/register", (req, res) => {
  const registerLogger = new LoggerService("register");
  registerLogger.logInfo("User registered");
  res.send("Hello from register path!");
});

app.get("*", (req, res) => {
  const notFoundLogger = new LoggerService("not-found");
  notFoundLogger.logError("invalid path");
  res.send("Hello from not-found path!");
});
