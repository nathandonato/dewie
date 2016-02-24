// addResourceController.js

var addResourceController = function(req, res, Resource, trie){
    this.req      = req;
    this.res      = res;
    this.Resource = Resource;
    this.data     = {};
    this.resource = null;
    this.trie     = trie;

    // We have to format the request in such a way that our DB understands it
    this.parseData = function(){
        this.data = {
            name       : req.body.name,
            available  : true,
            lastUsed   : Date.now(),
            lastUsedBy : ""
        }
    };

    // Create the resource
    this.createResource = function(){
        this.parseData();
        var newResource = new this.Resource(this.data);
        this.saveResource(newResource);
    };

    // Save the resource
    this.saveResource = function(newResource){
        newResource.save(function(error, data){
            // return error or object
            if(error){
                res.json(error);
            }
            else{
                res.json(data);
            }
        });
    };

    // Add resource to our trie dictionary
    this.addResourceToTrie = function(){
        this.trie.addWord(req.body.name);
    }
}

module.exports = addResourceController;