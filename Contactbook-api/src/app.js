const express = require("express");
const cors = require("cors");
// const path = require('path');
const JSend = require("./jsend");
const contactsRouter = require("./routes/contacts.router");
const {
  resourceNotFound,
  handleError,
} = require("./controllers/errors.controller");
const { specs, swaggerUi } = require("./docs/swagger");
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get("/", (req, res) => {
  return res.json(JSend.success());
});
// app.use('/public', express.static(path.join(__dirname, 'public')));
app.use("/public", express.static("public"));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
contactsRouter.setup(app);
app.use(resourceNotFound);
app.use(handleError);
module.exports = app;
