import { EventEmitter } from "events";
import express from "express";
import LoggerService from "./services/logger-service.js";
import { getAudits, createAuditTable, insertAudit } from "./db.js";

export const auditEmitter = new EventEmitter();
const auditEvent = "audit";

export const audit = (auditAction, data, status, error, auditBy, auditOn) => {
  const auditData = {
    auditAction,
    data: JSON.stringify(data),
    status,
    error,
    auditBy,
    auditOn,
  };

  auditEmitter.emit(auditEvent, auditData);
};

auditEmitter.on(auditEvent, async (auditData) => {
  console.log("Received audit event:", auditData);

  try {
    await insertAudit(
      auditData.auditAction,
      auditData.data,
      auditData.status,
      auditData.error,
      auditData.auditBy,
      auditData.auditOn
    );
    console.log("Audit saved to database!");
  } catch (error) {
    console.error("Error saving audit:", error);
    console.error("Audit data that failed to save:", auditData);
  }
});

const app = express();

app.use(express.static("public"));

app.listen(3000, async () => {
  await createAuditTable();
  console.log("Server is running on port 3000");
});

app.get("/login", async (req, res) => {
  const loginLogger = new LoggerService("login");
  loginLogger.logInfo("User logged in", { name: "Ali" });

  audit("USER_LOGIN", { username: "Ali" }, "SUCCESS", null, "Ali", new Date());

  res.send("Login event logged!");
});

app.get("/register", async (req, res) => {
  const registerLogger = new LoggerService("register");
  registerLogger.logInfo("User registered");

  audit(
    "USER_REGISTER",
    { username: "NewUser" },
    "SUCCESS",
    null,
    "NewUser",
    new Date()
  );

  res.send("✅ Register event logged!");
});

app.get("/show-audits", async (req, res) => {
  const getAuditsLogger = new LoggerService("get-audits");
  getAuditsLogger.logInfo("User requested audits");

  audit("USER_REQUESTED_AUDITS", null, "SUCCESS", null, "System", new Date());
  const audits = await getAudits();
  console.log("Audits mad:", audits);

  res.send({ message: "Audits retrieved!", audits });
});

app.get("*", (req, res) => {
  const notFoundLogger = new LoggerService("not-found");
  notFoundLogger.logError("Invalid path");

  audit(
    "INVALID_PATH",
    { path: req.path },
    "FAILED",
    "404 Not Found",
    "System",
    new Date()
  );

  res.status(404).send("Not Found!");
});
