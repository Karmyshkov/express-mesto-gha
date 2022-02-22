const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { PORT, uri } = require('./config/config');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use((req, res, next) => {
  req.user = {
    _id: '620917d44dc4e2fb3bff68ed',
  };

  next();
});

app.use('/', require('./routes/user'));
app.use('/', require('./routes/card'));

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.listen(PORT);
