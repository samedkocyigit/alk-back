const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");

const userRouter = require("./src/routes/userRoutes");
const productRouter = require("./src/routes/productRoutes");
const categoryRouter = require("./src/routes/categoryRoutes");
const commentRouter = require("./src/routes/commentRoutes");

const app = express();

app.use(morgan("dev"));
app.use(bodyParser.json());

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// Routes
app.use("/users", userRouter);
app.use("/products", productRouter);
app.use("/category", categoryRouter);
app.use("/comments", commentRouter);

//app.use(globalErrorHandler);

module.exports = app;
