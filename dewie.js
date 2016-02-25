// dewie.js
// Dewie is a resource management framework designed for internal use at a company

// ========
// REQUIRES
// ========
var express    = require("express");
var dewieTrie  = require("./dewieTrie/trieNode.js");
var mongoose   = require("mongoose");
var bodyParser = require("body-parser");
var seedDbController = require("./controllers/seedDbController.js");
var requestResourceController = require("./controllers/requestResourceController.js");
var autocompleteController = require("./controllers/autocompleteController.js");
var addResourceController = require("./controllers/addResourceController.js");
var trieFromDb = require("./dewieTrie/trieFromDb.js");

// =========
// TRIE PREP
// =========
var trie = new dewieTrie("");

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
    name        : { type : String, unique : true, required : true },
    leaseExpire : { type: Date, default : '01/01/1980' },            
    lastUsedBy  : String
});
// Define model
var Resource = mongoose.model('Resource', resourceSchema, 'resources');

// Seed sample data * (Note that this is only for demonstration purposes)
db.collection('resources').findOne({name: 'Applesauce'}, function (err, doc){
    if(err || doc == null){
        var seedDb = new seedDbController(db, Resource, trie);
        seedDb.seedDb();
    }
});

// ========
// APP PREP
// ========
// Start the app
var app  = express();
// Use body parser
app.use( bodyParser.json() ); // to support JSON-encoded bodies
// Include static files
app.use(express.static(__dirname + '/app'));

// When first starting the application, we'll want to initialize our trie from our resource collection
// NOTE: This assumes a small amount of objects in our db and that this application is running on its own server that has plenty of resources.
var initializeTrie = new trieFromDb(Resource, trie);
initializeTrie.buildTrieFromDb();

// ======
// ROUTES
// ======
app.get("/", function(req, res){
    console.dir(JSON.stringify(trie.placeMarker("ap").getOffspring("ap", [])));
    res.sendFile(__dirname + "/app/index.html");
    console.log(__dirname);
})

app.post("/requestResource", function(req, res){
    var requestResource = new requestResourceController(req, res, db);
    requestResource.findResource();
})

app.post("/autocomplete", function(req, res){
    var autocomplete = new autocompleteController(req, res, trie);
    autocomplete.getAutocompleteResults();
})

app.post("/addResource", function(req, res){
    var addResource = new addResourceController(req, res, Resource, trie);
    addResource.createResource();
    addResource.addResourceToTrie();
})

// LISTEN
// ======
app.listen(3000, function(){
    console.log('Dewie Resource Management system is ready!');
    console.log('Visit http://127.0.0.1:3000/ to get started.');
});
