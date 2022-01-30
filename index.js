/* some variables
//
//
//
*/

var mysql = require("mysql");
var bodyParser = require("body-parser");
const express = require("express");
const req = require("express/lib/request");
const app = express();
const port = 3000;

/* create databse connection
//
//
//
*/

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "test"
});

con.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
});

/* starts the server
//
//
//
*/

app.use(bodyParser.json());

app.listen(port, () => {
    //console log when server is running
    console.log(`App Listening on port ${port}`);
});

/* as json format 
/
/
/
*/

app.get("/info", (req, res) => {
    //get number of rows in table
    con.query('SELECT * FROM acchash WHERE hash', function (error, results, fields) {
        if (error) {
            //returns error
            res.status(500).send({
                "status": "error",
                "inDB": 0
            });
            throw error;
        }
        //returns success + number of rows in table
        res.status(200).send({
            "status": "success",
            "inDB": results.length
        });
    });
});

app.post("/testdb", (req, res) => {
    var givenHash = req.body.hash.toLowerCase();
    if (String(Object.keys(givenHash).length) != 64) return res.status(400).send("error invalid hash provided")
    con.query('SELECT * FROM acchash WHERE hash', function (error, results, fields) {
        if (results.length > 0) {
            for (var i = 0; i < results.length; i++) {
                if (results[i].hash == givenHash) {
                    return res.status(200).send({ "exists": true });
                }
            }
            insertValur(givenHash);
            return res.status(200).send({ "exists": false });
        }
        return res.status(500).send("error with database");
    });
});



/* Blank request just output the value not in json format 
//
//
//
*/
app.post("/testdb/blank", (req, res) => {
    var givenHash = req.body.hash.toLowerCase();
    if (String(Object.keys(givenHash).length) != 64) return res.status(400).send("error invalid hash provided")
    con.query('SELECT * FROM acchash WHERE hash', function (error, results, fields) {
        if (results.length > 0) {
            for (var i = 0; i < results.length; i++) {
                if (results[i].hash == givenHash) {
                    return res.status(200).send("true"); //{"exists": true} as json
                }
            }
            insertValur(givenHash);
            return res.status(200).send("false"); //{"exists": false} as json
        }
        return res.status(500).send("error with database");
    });
});

app.get("/info/blank", (req, res) => {
    //get number of rows in table
    con.query('SELECT * FROM acchash WHERE hash', function (error, results, fields) {
        if (error) {
            //returns error
            res.status(500).send("error");
            throw error;
        }
        //returns success + number of rows in table
        res.status(200).send(results.length.toString());
    });
});


/* databse functions
//
//
//
*/

function insertValur(hash) {
    con.query('INSERT INTO acchash (hash) VALUES (?)', [hash], function (error, results, fields) {
        if (error) throw error;
        console.log("1 record inserted");
    });
}
