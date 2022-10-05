const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    default: 'Жак-Ив Кусто',
    minlength: 2,
    maxlength: 30,
  },
  about: {
    type: String,
    default: 'Исследователь',
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    match: [/^http(s)?:\/\/(www.)?([0-9A-Za-z.@:%_/+-~#=]+)+(.[a-zA-Z]{2,3})(\/[0-9A-Za-z.@:%_/+-~#=]+)*$/, 'Некорректный адрес аватара'],
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator(v) {
        return validator.isEmail(v);
      },
      message: 'Неправильно введен email',
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

userSchema.statics.findUserByEmailAndPass = function (email, password) {
  return this.findOne({ email }).select('+password')
    .orFail(() => {
      const error = new Error('Неправильные почта или пароль');
      error.statusCode = 401;
      throw error;
    })
    .then((user) => bcrypt.compare(password, user.password)
      .then((isMatched) => {
        if (!isMatched) {
          return Promise.reject(new Error('Неправильные почта или пароль'));
        }
        return user;
      }));
};

module.exports = mongoose.model('user', userSchema);
