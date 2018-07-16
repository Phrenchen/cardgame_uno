const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");
const phrensUno = require("./routes/api/phrensUno");
const app = express();
const {initDB} = require("./model/InitDB");

// body parser middleware
app.use(bodyParser.json());

// DB config
const db = require("./config/keys").mongoURI;

//mongoose.connection.dropCollection();

// connect to db
mongoose
.connect(db)
.then(() => {
    console.log("mongoDB connected")
        mongoose.connection.dropDatabase(); // <---- DROP DATA!
        initDB();
    })
    .catch((e) => console.log(e))


// use route
app.use("/api/phrens_uno", phrensUno)

// serve static assets if we are in production
if(process.env.NODE_ENV === "production"){
    // set static folder
    app.use(express.static("client/build"));

    app.get("*", () =>{
        res.sendFile(path.resolve(__dirname, "client", "build", "index.html"))
    });
}

const port = process.env.PORT || 5000;

app.listen(port, () => console.log("server started on port " + port));