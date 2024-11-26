const errorHandler = (err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || 'Something went wrong';

  res.status(500).send({
    status,
    message,
    data: status === 500 ? 'Internal Server Error' : err.message,
  });
};

export default errorHandler;
