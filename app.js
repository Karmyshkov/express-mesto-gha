const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const { PORT, uri } = require("./config/config");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use((req, res, next) => {
  req.user = {
    _id: "62149e70772c6082b3373106",
  };

  next();
});

app.use("/", require("./routes/user"));
app.use("/", require("./routes/card"));

app.use((req, res) => {
  res.status(404).send({ message: "Страница не найдена" });
});

mongoose.connect(uri, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.listen(PORT);
