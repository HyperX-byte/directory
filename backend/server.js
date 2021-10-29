const express = require("express");
const env = require("dotenv");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");

// Routes
const userRoutes = require("./routes/users");

// Environment CONFIG
env.config();

//MongoDB Connection
mongoose
  .connect(
    `mongodb+srv://user_281:j0nDPKayUjcqlYgS@cluster0.i2buf.mongodb.net/directory?retryWrites=true&w=majority`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
  )
  .then(() => {
    console.log("Database Connected");
  });

app.set('port', 8081);
app.use(cors());
app.use(express.json());
app.use("/api", userRoutes);

app.listen(8081, () => {
  console.log(`Server is running on port 8081`);
});
