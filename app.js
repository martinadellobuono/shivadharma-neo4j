const express = require("express");
const path = require("path");
const formidable = require("formidable");

var app = express();

app.use(express.static("public"));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// index
app.get("/", (req, res) => {
    res.render("index");
});

// initialize the edition
const initializeEdition = require("./routes/initializeEdition");
app.use("/", initializeEdition);

// get started
const getStarted = require("./routes/getStarted");
app.use("/", getStarted);

// add annotations
const addAnnotations = require("./routes/addAnnotations");
app.use("/", addAnnotations);

// get the edition
const edition = require("./routes/edition");
app.use("/", edition);

// get the list of editions
const editions = require("./routes/editions");
app.use("/", editions);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Shivadharma listening on port localhost:${port}`));

module.exports = app;