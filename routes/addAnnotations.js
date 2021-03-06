const express = require("express");
const path = require("path");
const formidable = require("formidable");
const bodyParser = require("body-parser");

const neo4j = require("neo4j-driver");
const driver = neo4j.driver("bolt://localhost:7687", neo4j.auth.basic("neo4j", "123456"));

const router = express.Router();

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended:false}));

router.post("/addAnnotations/:id", async (req, res) => {    
    var idEdition = req.params.id.split("/").pop().split("-")[0];
    var idEditor = req.params.id.split("/").pop().split("-")[1];
    var form = formidable();
    form.parse(req);
    form.on("fileBegin", (name, file) => {
        file.path = `${__dirname}/../uploads/${file.name}`;
    });
    form.on("file", async (name, file) => {
        const session = driver.session();
        try {
            const data = await session.writeTransaction(tx => tx
                .run(`MATCH (editor:Editor) WHERE id(editor) = ${idEditor} MERGE (file:File {name: $file}) MERGE (file)-[p:PRODUCED_BY]->(editor) RETURN file.name`, {file: file.name})                
            );
            const results = data.records.map(row => {
                const file = row["_fields"];
                return file;
            });
            res.render("addAnnotations", {
                id: req.params.id,
                file: results
            });
        } catch (err) {
            console.log("Error related to Neo4j: " + err);
        } finally {
            await session.close();
        };
    });
    form.on("error", (err) => {
        console.log(err);
    })
    form.on("end", () => {
        console.log("File uploaded");
    });
});

module.exports = router;