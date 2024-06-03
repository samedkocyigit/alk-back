const express = require("express");
const path = require("path");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
//const helmet = require("helmet");
//const mongoSanitize = require("express-mongo-sanitize");
//const xss = require("xss-clean");
//const hpp = require("hpp");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const cors = require("cors");

const AppError = require("./src/utils/appError");
const globalErrorHandler = require("./src/services/errorService");
const userRouter = require("./src/routes/userRoutes");
const productRouter = require("./src/routes/productRoutes");
const categoryRouter = require("./src/routes/categoryRoutes");
const commentRouter = require("./src/routes/commentRoutes");
const overviewRouter = require("./src/routes/overviewRoutes");
const brandRouter = require("./src/routes/brandRoutes");
const sliderRouter = require("./src/routes/sliderRoutes");
const cartRouter = require("./src/routes/cartRoutes");
const addressRouter = require("./src/routes/addressRoutes");
const orderRouter = require("./src/routes/orderRoutes");

const app = express();
var corsOptions = {
  origin: "http://127.0.0.1:3001",
};

app.use(cors(corsOptions));

// 1) GLOBAL MIDLLEWARES
// app.set("view-engine", "ejs");
// Serving static files
// const staticFilesPath = path.join(__dirname, "../frontend/dist");
// const vueAppPath = path.join(__dirname, "../frontend", "../frontend/dist");
// app.use(express.static(path.join(__dirname, "assets")));

// Statik dosyaları servis etme
// const staticFilesPath = path.join(__dirname, "../frontend/dist");
// app.use(express.static(staticFilesPath));

// Set security HTTP headers
//app.use(helmet());

// Development logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Limit request from same API
// const limiter = rateLimit({
//   max: 1000,
//   windowMs: 60 * 60 * 1000,
//   message: "Too many request from this IP, Please try again in a hour",
// });
// app.use("/", limiter);

app.use(cookieParser());

// Body parser, reading data from body into req.body
// app.use(bodyParser.json());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Data sanitization against NoSql query injection
//app.use(mongoSanitize());

// Data sanitization against XSS
//app.use(xss());

// Prevent parameter pollution
// app.use(
//   hpp({
//     whitelist: ["price", "ratingsQuantity", "ratingsAverage", "brand"],
//   })
// );

// Test Middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// app.use(express.static(vueAppPath));
// app.use(express.static(staticFilesPath));

// Routes
app.use("/", overviewRouter);
app.use("/users", userRouter);
app.use("/products", productRouter);
app.use("/categories", categoryRouter);
app.use("/comments", commentRouter);
app.use("/brands", brandRouter);
app.use("/sliders", sliderRouter);
app.use("/carts", cartRouter);
app.use("/address", addressRouter);
app.use("/orders", orderRouter);

// app.get("*", (req, res) => {
//   res.sendFile(path.join(vueAppPath, "index.html"));
// });
// Frontend'e yönlendirme
// app.get("*", (req, res) => {
//   res.sendFile(path.join(staticFilesPath, "index.html"));
// });

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
