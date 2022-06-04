const express = require("express");
const bodyParser = require("body-parser");

const neo4j = require("neo4j-driver");
const driver = neo4j.driver("bolt://localhost:7687", neo4j.auth.basic("neo4j", "123456"));

const router = express.Router();

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended:false}));

router.get("/addMetadata/:id", async (req, res) => {
    var idEdition = req.params.id.split("/").pop().split("-")[0];
    var idEditor = req.params.id.split("/").pop().split("-")[1];
    const session = driver.session();
    try {
        const data = await session.readTransaction(tx => tx
            .run(`MATCH (edition:Edition) MATCH (editor:Editor) MATCH (work:Work)-[w:WRITTEN_BY]->(author:Author) WHERE id(edition) = ${idEdition} AND id(editor) = ${idEditor} RETURN edition.title, author.name, editor.name`)                
        );
        const title = data.records[0]["_fields"][0]
        const author = data.records[0]["_fields"][1]
        const editor = data.records[0]["_fields"][2]
        res.render("addMetadata", {
            id: req.params.id,
            title: title,
            author: author,
            editor: editor
        });
    } catch (err) {
        console.log("Error related to Neo4j: " + err);
    } finally {
        await session.close();
    };
});

router.post("/addMetadata/:id", async (req, res) => {
    var idEdition = req.params.id.split("/").pop().split("-")[0];
    var idEditor = req.params.id.split("/").pop().split("-")[1];
    const session = driver.session();
    try {
        const data = await session.writeTransaction(tx => tx
            .run(`MATCH (edition:Edition)-[e:EDITED_BY]->(editor:Editor) MATCH (work:Work)-[w:WRITTEN_BY]->(author:Author) WHERE id(edition) = ${idEdition} AND id(editor) = ${idEditor} MERGE (edition)-[p:PUBLISHED_ON]->(date:Date {date: $date}) MERGE (date)-[ed:EDITION_BY]->(editor) RETURN edition.title, author.name, editor.name, date.date`, {date: req.body.date})                
        );
        const title = data.records[0]["_fields"][0]
        const author = data.records[0]["_fields"][1]
        const editor = data.records[0]["_fields"][2]
        const date = data.records[0]["_fields"][3]
        res.render("addAnnotations", {
            id: req.params.id,
            title: title,
            author: author,
            editor: editor,
            date: date
        });
    } catch (err) {
        console.log("Error related to Neo4j: " + err);
    } finally {
        await session.close();
    };
});

module.exports = router;