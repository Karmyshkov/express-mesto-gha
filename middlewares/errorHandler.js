const errorHandler = (err, req, res) => {
  res.status(err.statusCode).send({
    message: err.message,
    err,
  });
};

module.exports = errorHandler;
