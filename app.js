const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const cookieParser = require('cookie-parser');
const NotFoundError = require('./errors/NotFoundError');
const auth = require('./middlewares/auth');
const {
  loginValidate,
  createUserValidate,
} = require('./middlewares/validation');
const { login, createUser } = require('./controllers/user');
require('dotenv').config();

const { URI = 'mongodb://localhost:27017/mestodb', PORT = 3000 } = process.env;

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cookieParser());

app.post('/signin', loginValidate, login);
app.post('/signup', createUserValidate, createUser);

app.use('/', auth, require('./routes/user'));
app.use('/', auth, require('./routes/card'));

app.use(auth, () => {
  throw new NotFoundError();
});

app.use(errors());

app.use(require('./middlewares/errorHandler'));

mongoose.connect(URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.listen(PORT);
