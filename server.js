const mongoose = require("mongoose");
const dotenv = require("dotenv");

process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config({ path: "./config.env" });
const app = require("./app");

mongoose.connect(process.env.DATABASE_LOCAL, {}).then(() => {
  console.log("DB connection successfully");
});

const hostname = process.env.LOCALHOST || "127.0.0.1";
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server running on --> http://${hostname}:${port}/`);
});

process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  process.exit(1);
});
