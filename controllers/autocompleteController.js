//autocompleteController.js

var addResourceController = function(req, res, trie){
    this.req    = req;
    this.res    = res;
    this.trie   = trie;
    this.string = req.body.string.toUpperCase();

    this.getAutocompleteResults = function(){
        // If an empty query, don't bother finding any results
        if (this.string == ""){
            res.send(JSON.stringify([]));
            return;
        }
        var marker = trie.placeMarker(this.string);

        // If the query doesn't return any results, return 0 results
        if(!marker){
            res.send(JSON.stringify([]));
            return;
        }

        // Return the results
        res.send(JSON.stringify(marker.getOffspring(this.string, [])));
    };
}

module.exports = addResourceController;