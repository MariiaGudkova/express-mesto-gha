const { SERVER_ERROR_CODE } = require('../utils/constants');

// eslint-disable-next-line no-unused-vars
module.exports = (err, req, res, next) => {
  const { statusCode = SERVER_ERROR_CODE, message: errorMessage } = err;
  const message = statusCode === SERVER_ERROR_CODE
    ? 'На сервере произошла ошибка'
    : errorMessage;
  res
    .status(statusCode)
    .send({ message });
};
