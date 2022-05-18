var express = require("express");
const path = require("path");
var formidable = require("formidable");

var app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// index
app.get("/", (req, res) => {
    res.render("index");
});

// get started
const getStarted = require("./routes/getStarted");
app.use("/", getStarted);

// add annotations
const addAnnotations = require("./routes/addAnnotations");
app.use("/", addAnnotations);

// get the edition
const getEdition = require("./routes/getEdition");
app.use("/", getEdition);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Shivadharma listening on port localhost:${port}`));

module.exports = app;