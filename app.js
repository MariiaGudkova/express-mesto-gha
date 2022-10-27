const express = require('express');
const mongoose = require('mongoose');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const { errors } = require('celebrate');
const routes = require('./routes/index');
require('dotenv').config();

const { PORT = 3000, MONGO_URL = 'mongodb://localhost:27017/mestodb' } = process.env;
const app = express();
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
const { SERVER_ERROR_CODE } = require('./utils/constants');

mongoose.connect(MONGO_URL);

app.use(express.json());
app.use(apiLimiter);
app.use(helmet());
app.use(routes);

app.use(errors());
app.use((err, req, res, next) => {
  const { statusCode = SERVER_ERROR_CODE, message: errorMessage } = err;
  const message = statusCode === SERVER_ERROR_CODE
    ? 'На сервере произошла ошибка'
    : errorMessage;
  res
    .status(statusCode)
    .send({ message });
});

app.listen(PORT, () => {});
