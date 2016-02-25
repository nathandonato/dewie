// requestResourceController.js

var requestResourceController = function(req, res, Resource){
	this.req      = req;
    this.res      = res;
    this.Resource = Resource;
    this.name     = req.body.name;

    this.findResource = function(){
    	console.dir(Resource.findOne({ name : this.name}));
    	// res.send(JSON.stringify(Resource.findOne({ "name" : this.name})));
    }
}

module.exports = requestResourceController;