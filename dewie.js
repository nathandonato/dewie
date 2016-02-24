// dewie.js
// Dewie is a resource management framework designed for internal use at a company

// ========
// REQUIRES
// ========
var express   = require("express");
var dewieTrie = require("./dewieTrie/trieNode.js");
var mongoose  = require("mongoose");
var bodyParser = require("body-parser");

// =======
// DB PREP
// =======

// Establish connection
mongoose.connect("mongodb://localhost/dewieDb");
var db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", function(){
  console.log("Successfully connected to database");
});

// Define schema 
var resourceSchema = mongoose.Schema({
    name       : { type : String, unique : true, required : true },
    available  : Boolean,
    lastUsed   : Date,
    lastUsedBy : String
});
// Define model
var Resource = mongoose.model('Resource', resourceSchema, 'resources');

// ========
// APP PREP
// ========
// Start the app
var app  = express();
// Use body parser
app.use( bodyParser.json() ); // to support JSON-encoded bodies

// We'll access our trie through the root node.
var trie = new dewieTrie("");

// When first starting the application, we'll want to initialize our trie from our resource collection
// NOTE: This assumes a small amount of objects in our db and that this application is running on its own server that has plenty of resources.
var trieFromDb = require("./dewieTrie/trieFromDb.js");
var initializeTrie = new trieFromDb(Resource, trie);
initializeTrie.buildTrieFromDb();

// ======
// ROUTES
// ======
app.get("/", function(req, res){
    console.dir(JSON.stringify(trie.placeMarker("ap").getOffspring("ap", [])));
    // console.dir(trie);
    res.sendFile(__dirname + "/public/index.html");
})

app.get("/findWord", function(req, res){
    // trie.findWord(req.word)
    // return the result
})

app.post("/requestResource", function(req, res){
    // 
})

app.get("/resource", function(req, res){
    // db.get(req.name)
    // perhaps a get controller -- maybe dbVerbs.js?
})

app.post("/addResource", function(req, res){
    var addResourceController = require("./controllers/addResourceController.js");
    var addResource = new addResourceController(req, res, Resource, trie);
    addResource.createResource();
    addResource.addResourceToTrie();
})

// LISTEN
// ======
app.listen(3000, function(){
    console.log('Example app listening on port 3000!');
});
