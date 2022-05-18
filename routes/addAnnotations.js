const express = require("express");
const path = require("path");
const formidable = require("formidable");
var bodyParser = require("body-parser");

const neo4j = require("neo4j-driver");
const driver = neo4j.driver("bolt+s://localhost:7687", neo4j.auth.basic("neo4j", "123456"));
const session = driver.session();

const router = express.Router();

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended:false}));

router.post("/addAnnotations", (req, res) => {
    var form = formidable();
    form.parse(req);
    form.on("fileBegin", (name, file) => {
        file.path = `${__dirname}/../uploads/${file.name}`;
    });
    form.on("file", (name, file) => {
        session.writeTransaction(tx => tx
            .run("MERGE (file:File {name: $file}) RETURN file", {file: file.name})
            .then(async () => {
                console.log(file.name + " has been added to the graph");
            })
            .catch((err) => {
                console.log("This is the error when trying to upload data to Neo4j: " + err);
            })
        );
    });
    form.on("error", (err) => {
        console.log(err);
    })
    form.on("end", () => {
        res.render("addInfo");
    });
});

module.exports = router;