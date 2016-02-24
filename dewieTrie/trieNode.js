// trieNode.js

var trieNode = function(character) {
    this.trieNode = require ("./trieNode.js");
    this._char    = character;
    this.children = {};

    this.addChildChar = function(character){
        // If the next character in the word is not yet a child of this node, add it.
        if (!(character in this.children)){
            this.children[character] = new this.trieNode(character);
        }
        // Return the object.
        return this.children[character];
    };

    this.addWord = function(word){
        // Add the next character as a child to this one.
        this.addChildChar(word[0]);
        // If the word is only one character, then the word is complete.
        if (word.length == 1){
            return true;
        }
        // If there are more letters, we'll continue down the line, adding each character as a child of the next.
        // We'll massage the data a little, making sure to only pass the relevant characters.
        return this.children[word[0]].addWord(word.slice(1, word.length));
    };


    this.findWord = function(word){
        // There are many things to consider here:
        if (word[0] in this.children){
            // If the character exists as a child but is the only character, then we can return true, as we have located the word.
            if (word.length == 1){
                return true;
            }
            // But if there are more characters, then we'll keep looking.
            else {
                return this.children[word[0]].findWord(word.slice(1, word.length));
            }
        // And if the character isn't a child of this node at all, then we can say the word does not exist and return false.
        } else {
            return false;
        }
    };
    // predictWord : function(){

    // }
}

module.exports = trieNode;
