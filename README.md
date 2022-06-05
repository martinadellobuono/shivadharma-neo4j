# Śivadharma Database Project

**Śivadharma Database** is a [Neo4j](https://neo4j.com/) web application built with [Node.js](https://nodejs.org/en/). 
The project is ongoing and under development.

## Quick start

The project works with:

- [**Node.js**](https://nodejs.org/en/) v16.14.2
- [**Express**](https://www.npmjs.com/package/express)
- [**body-parser**](https://www.npmjs.com/package/body-parser)
- [**ejs**](https://www.npmjs.com/package/ejs)
- [**express-validator**](https://www.npmjs.com/package/express-validator)
- [**formidable**](https://www.npmjs.com/package/formidable)
- [**neo4j-driver**](https://www.npmjs.com/package/neo4j-driver)

Packages can be installed with either [**NPM**](https://www.npmjs.com/).

After installing the required packages:

- Download **Neo4j Desktop**: https://neo4j.com/download/
- Create a new **Project**
- Click on the button **Add**
- Select **Remote connection**
- Insert the **Connection URL**: bolt://localhost:7687
- Insert the credentials:
  **Username**: neo4j
  **Password**: 123456
- Run the application locally: **nodemon app.js**
- Open the application in your browser: **http://0.0.0.0:3000/**
