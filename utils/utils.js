const INPUT_ERROR = 400;
const NOT_FOUND_ERROR = 404;
const DEFAULT_ERROR = 500;

module.exports.errorHandler = (err, res) => {
  if (err.name === 'NotFoundError') {
    res.status(NOT_FOUND_ERROR).send({ message: err.message });
  } else if (err.name === 'ValidationError') {
    res.status(INPUT_ERROR).send({ message: 'Переданы некорректные данные при постановке/снятии лайка' });
  } else res.status(DEFAULT_ERROR).send({ message: 'Ошибка на стороне сервера' });
};
