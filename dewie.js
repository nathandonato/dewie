// dewie.js
// Dewie is a resource management framework designed for internal use at a company

// Requires
var express = require("express");
var dewieTrie = require("./dewieTrie/trieNode.js");

// We'll access our trie through the root node.
var trie = new dewieTrie(" ");

// App and routes
var app = express();

app.get("/", function(req, res){
	trie.addChildWord("hello");
	trie.addChildWord("help");

	console.log(trie.findChildWord("hello").toString());
	console.log(trie.findChildWord("he").toString());
	console.log(trie.findChildWord("helper").toString());
	res.send("hi");
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});