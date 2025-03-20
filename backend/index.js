const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();

const cors = require("cors");

app.use(express.json());
app.use(cors());


app.use("/btc",require("./routes/route"));

app.use(express.urlencoded({ extended: false }));

const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
