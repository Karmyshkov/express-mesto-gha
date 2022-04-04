const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const NotFoundError = require("./errors/NotFoundError");
const auth = require("./middlewares/auth");
require("dotenv").config();

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post("/signin", require("./controllers/user").login);
app.post("/signup", require("./controllers/user").createUser);

app.use("/", auth, require("./routes/user"));
app.use("/", auth, require("./routes/card"));

app.use(() => {
  throw new NotFoundError();
});

app.use(require("./middlewares/errorHandler"));

mongoose.connect(process.env.URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.listen(process.env.PORT);
