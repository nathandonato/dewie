// seedDb.js

//Note, this is only to seed enough data into the DB so that the demonstration is adequate.
var seedDbController = function(db, Resource, trie){
    this.Resource = Resource;
    this.trie = trie;

    // Our sample data
    this.sampleData = [
        {name : "HARD DRIVE 1" , lastUsedBy : "Tom" },
        {name : "HARD DRIVE 2" , lastUsedBy : "Janet" },
        {name : "SSD 1" , lastUsedBy : "Nathan" },
        {name : "SSD 2" , lastUsedBy : "Tom" },
        {name : "MACBOOK 1" , lastUsedBy : "Janet" },
        {name : "MACBOOK PRO 1" , lastUsedBy : "Tom" },
        {name : "MACBOOK PRO 2" , lastUsedBy : "Janet" },
        {name : "MACBOOK AIR 1" , lastUsedBy : "Janet" }
    ];

    // Add resource to our trie dictionary
    this.addResourceToTrie = function(obj){
        this.trie.addWord(obj.name.toUpperCase());
    }

    // Create the resource
    this.createResource = function(obj){
        var newResource = new this.Resource(obj);
        newResource.save(function(error, data){
           // do nothing
        });
    };

    // Seed each of our sample data
    this.seedDb = function(){
        var self = this;
        this.sampleData.forEach(function(obj){
            self.createResource(obj);
            self.addResourceToTrie(obj);
        });
    };
}

module.exports = seedDbController;