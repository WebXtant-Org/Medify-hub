const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

const errorHandler = (error, req, res, next) => {
  console.error("SERVER ERROR:", error);
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: error.message || 'An unknown error occurred',
    stack: process.env.NODE_ENV === 'production' ? null : error.stack,
  });
};

export { notFound, errorHandler };
