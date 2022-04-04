const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const NotFoundError = require("./errors/NotFoundError");
const { PORT, uri } = require("./config/config");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post("/signin", require("./controllers/user").login);
app.post("/signup", require("./controllers/user").createUser);

app.use(require("./middlewares/auth"));

app.use("/", require("./routes/user"));
app.use("/", require("./routes/card"));

app.use(() => {
  throw new NotFoundError();
});

app.use(require("./middlewares/errorHandler"));

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.listen(PORT);
