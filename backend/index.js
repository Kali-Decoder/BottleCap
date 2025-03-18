const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
const PORT = 8080;
const cors = require("cors");
app.use(express.json());
app.use(cors());
app.use("/btc",require("./routes"));
app.use(express.urlencoded({ extended: false }));
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
