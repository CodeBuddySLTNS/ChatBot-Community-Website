const express = require("express");
const http = require("http");
const cors = require("cors");
const dotenv = require("dotenv").config();
const cookieParser = require("cookie-parser");
const { Server } = require("socket.io");

const authenticate = require("./middlewares/authentication");
const connectMongoDB = require("./database/connectMongoDB");

const PORT = process.env.PORT || 6870;
const app = express();
const server = http.createServer(app);
const io = new Server(server);
const frontend = [process.env.FRONTEND, "http://localhost:5173"];

const corsOptions = { origin: frontend };

// middlewares
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(authenticate);
app.use((req, res, next) => {
  console.log(req.path);
  next();
});

// routes
app.get("/", (req, res) => res.send("ChatBot Community Server 🤖"));
app.use(require("./routes/views"));
app.use(require("./routes/login-page"));
app.use(require("./routes/user-profile"));
app.use("/api/websites", require("./routes/websites-page"));
app.use("/api/homepage", require("./routes/homepage"));
app.use("/api/apis", require("./routes/api-page"));
app.use("/api/fbpages", require("./routes/fbpage"));
app.use("/api/fbpages", require("./routes/fbpage"));
app.use("/api/posts", require("./routes/post-page"));

io.on("connection", socket => {
  console.log(socket.id);
});

// Database connection
connectMongoDB()
  .then(con => {
    console.log("Database connected.");
    // require("./database/models/user")
    //   .find({})
    //   .then(d => {});

    // Start the server
  })
  .catch(e => {
    console.log("Database connection error.");
    //process.exit(1);

    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}.`);
      console.log(`Frontend: ${frontend}`);
    });
  });
