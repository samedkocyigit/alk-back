const path = require("path");
const express = require("express");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const bodyParser = require("body-parser");
// const Vue = require("vue");
// const App = require("./src/frontend/src/App.vue");
// const VueRouter = require("vue-router");
// const axios = require("axios");
// const VueAxios = require("vue-axios");

const AppError = require("./src/utils/appError");
const globalErrorHandler = require("./src/services/errorService");
const userRouter = require("./src/routes/userRoutes");
const productRouter = require("./src/routes/productRoutes");
const categoryRouter = require("./src/routes/categoryRoutes");
const commentRouter = require("./src/routes/commentRoutes");

const app = express();

// Vue.use(VueRouter);
// Vue.use(VueRouter, axios);

// 1) GLOBAL MIDLLEWARES
// Serving static files
app.use(express.static(path.join(__dirname, "public")));

// Set security HTTP headers
app.use(helmet());

// Development logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Limit request from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many request from this IP, Please try again in a hour",
});
app.use("/api", limiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(bodyParser.json());

// Data sanitization against NoSql query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: ["price", "ratingsQuantity", "ratingsAverage", "brand"],
  })
);

// Test Middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// Routes
// const router = new VueRouter({
//   routes,
// });

// new Vue({
//   el: "#app",
//   router,
//   store,
//   render: (h) => h(App),
// });

app.use("/api/users", userRouter);
app.use("/api/products", productRouter);
app.use("/api/category", categoryRouter);
app.use("/api/comments", commentRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
