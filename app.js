const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const routerUsers = require('./routes/users');

const app = express();

app.use(bodyParser.json());
app.use('/users', routerUsers);
app.use('/users/:userId', routerUsers);

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.listen(3000, () => {
  console.log('Сервер запущен');
});
