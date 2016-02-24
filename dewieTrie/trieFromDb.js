// trieFromDb.js

var trieFromDb = function(model, trie){
	this.model = model;
	this.trie  = trie;

	// When we start our app, we'll want to initialize our trie of resource names based on the resources we have in our DB already
	this.buildTrieFromDb = function(){
		exports.trie = this.trie;
		this.model.find(function(err, results){
			results.forEach(function(resource){
				exports.trie.addWord(resource.name);
			})
		});
	}
}

module.exports = trieFromDb;