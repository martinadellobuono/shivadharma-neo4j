const express = require("express");
const bodyParser = require("body-parser");

const neo4j = require("neo4j-driver");
const driver = neo4j.driver("bolt://localhost:7687", neo4j.auth.basic("neo4j", "123456"));

const router = express.Router();

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended:false}));

router.get("/edition/:id", async (req, res) => {
    const idEdition = req.originalUrl.split("/").pop().split("-")[0];
    const idEditor = req.originalUrl.split("/").pop().split("-")[1]; 
    const session = driver.session();
    try {
        await session.readTransaction(tx => tx
            .run(`MATCH ((edition:Edition)-[w:WRITTEN_BY]->(author:Author)) MATCH (edition:Edition)-[e:EDITED_BY]->(editor:Editor) MATCH (file:File)-[p:PRODUCED_BY]->(editor:Editor) WHERE id(edition) = ${idEdition} AND id(editor) = ${idEditor} RETURN edition.title, author.name, editor.name, file.name`)
            .subscribe({
                onNext: record => {
                    res.render("edition", {
                        title: record.get("edition.title"),
                        author: record.get("author.name"),
                        editor: record.get("editor.name"),
                        file: record.get("file.name")
                    });
                },
                onCompleted: () => {
                    console.log("Data extracted from the graph");
                },
                onError: err => {
                    console.log("Error related to the extraction from Neo4j: " + err)
                }
            })
            .catch(err => {
                console.log("Error related to the extraction of data from Neo4j: " + err);
            })
        );
    } catch (err) {
        console.log("Error related to Neo4j: " + err);
    } finally {
        await session.close();
    };
});

module.exports = router;