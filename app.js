const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");

const viewRouter = require("./src/routes/viewRoutes");
const userRouter = require("./src/routes/userRoutes");

const app = express();

app.use(morgan("dev"));
app.use(bodyParser.json());

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// Routes
app.use("/", viewRouter);
app.use("/users", userRouter);

// app.use("/urun", productRouter);
// app.use("/kargo-takibi", cargoTrackingRouter);
// app.use("/hakkimizda", aboutUsRouter);
// app.use("/iletisim", contactRouter);
// app.use("/iletisim-formu", contactFormRouter);
// app.use("/fiyat-listesi", priceListRouter);
// app.use("/blog", blogRouter);
// app.use("/videolar", videosRouter);
// app.use("/kategori", categoryRouter);

//app.use(globalErrorHandler);

module.exports = app;
