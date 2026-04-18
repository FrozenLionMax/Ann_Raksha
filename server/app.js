const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

const authRoutes = require("./routes/authRoutes");
const testRoutes = require("./routes/testRoutes");
const donationRoutes = require("./routes/donationRoutes");

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/test", testRoutes);
app.use("/api/donations", donationRoutes);

app.get("/", (req, res) => {
  res.send("Food Waste Platform API Running");
});

module.exports = app;