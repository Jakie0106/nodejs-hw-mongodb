const errorHandler = (err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || 'Something went wrong';

  res.status(status).send({
    status,
    message,
    data: message,
  });
};

export default errorHandler;
