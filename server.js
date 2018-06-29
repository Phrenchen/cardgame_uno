const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");
const items = require("./routes/api/items");

const app = express();

// body parser middleware
app.use(bodyParser.json());

// DB config
const db = require("./config/keys").mongoURI;

// connect to db
mongoose
    .connect(db)
    .then(() => console.log("mongoDB connected") )
    .catch(() => console.log("err"))


// use routes
app.use("/api/items", items);

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

