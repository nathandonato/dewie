// seedDb.js

//Note, this is only to seed enough data into the DB so that the demonstration is adequate.
var seedDbController = function(db, Resource, trie){
    this.Resource = Resource;
    this.trie = trie;

    // Our sample data
    this.sampleData = [
        {name : "Apples" , lastUsedBy : "Tom" },
        {name : "Applesauce" , lastUsedBy : "Janet" },
        {name : "CD Player" , lastUsedBy : "Nathan" },
        {name : "CD-ROM" , lastUsedBy : "Tom" },
        {name : "MacBook" , lastUsedBy : "Janet" },
        {name : "MacBook Pro 1" , lastUsedBy : "Tom" },
        {name : "MacBook Pro 2" , lastUsedBy : "Janet" },
        {name : "MacBook Air 1" , lastUsedBy : "Janet" }
    ];

    // Seed each of our sample data
    this.seedDb = function(){
        var self = this;
        this.sampleData.forEach(function(obj){
            self.createResource(obj);
            self.addResourceToTrie(obj);
        });
    };

    // Create the resource
    this.createResource = function(obj){
        var newResource = new this.Resource(obj);
        newResource.save(function(error, data){
           // do nothing
        });
    };

    // Add resource to our trie dictionary
    this.addResourceToTrie = function(obj){
        this.trie.addWord(obj.name.toUpperCase());
    }
}

module.exports = seedDbController;