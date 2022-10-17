const express = require('express');
const mongoose = require('mongoose');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const routes = require('./routes/index');

const { PORT = 3000, MONGO_URL = 'mongodb://localhost:27017/mestodb' } = process.env;
const app = express();
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

mongoose.connect(MONGO_URL);

app.use(express.json());
app.use((req, res, next) => {
  req.user = {
    _id: '6345b221d4ce78023a629b0b',
  };

  next();
});
app.use(routes);
app.use(apiLimiter);
app.use(helmet());

app.listen(PORT, () => {});
