const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes/index');

const { PORT = 3000, MONGO_URL = 'mongodb://localhost:27017/mestodb' } = process.env;
const app = express();

mongoose.connect(MONGO_URL);

app.use(express.json());
app.use((req, res, next) => {
  req.user = {
    _id: '6345b221d4ce78023a629b0b',
  };

  next();
});
app.use(routes);

app.listen(PORT, () => {});
