// trieNode.js

var trieNode = function() {
    this.trieNode = require ("./trieNode.js");
    this.children = {};
    this.isWord   = false;

    this.addWord = function(word){
        word = word.toUpperCase();
        // If we have gone through the entire word, then catalogue it.
        if (word.length == 0){
            this.isWord = true;;
            return true;
        }

        nextLetter = word[0];

        // If the next letter does not exist as a child node, add it.
        if (!(nextLetter in this.children)){
            this.children[nextLetter] = new this.trieNode();
        }
        // Continue adding the word
        this.children[nextLetter].addWord(word.slice(1, word.length));
    };


    this.placeMarker = function(word){
        // If this is the last letter, we can place our marker here.
        if (word.length == 0){
            return this;
        }
        // But if there are more letters, then we'll keep looking.
        if (word[0] in this.children){            
            return this.children[word[0]].placeMarker(word.slice(1, word.length));
        } else {
            return false;
        }
    };

    this.getOffspring = function(wordSoFar, collectionOfWords){
        // We'll store a local copy of our collection so that we can manipulate its data
        var localCollection = collectionOfWords;

        // If there are no more children, return this word
        if (this.noChildren()){
            localCollection.push(wordSoFar);
            return localCollection;
        } 
        // If this is a word we've already established, signal a match but keep going
        if (this.isWord){
            localCollection.push(wordSoFar);
        }

        // Continue the depth first search
        for (var nextLetter in this.children){
            localCollection = this.children[nextLetter].getOffspring(wordSoFar + nextLetter, collectionOfWords);
        }

        return localCollection;
    };

    this.noChildren = function(){
        return !Object.keys(this.children).length;
    };
}

module.exports = trieNode;
