// requestResourceController.js

var requestResourceController = function(req, res, db){
    this.req       = req;
    this.res       = res;
    this.db        = db;
    this.dbObject  = null;
    // Lease time is in increments of hours. For ease of use, we'll just use 6 minutes.
    this.leaseTime = .1;
    this.name      = this.req.body.name.toUpperCase();

    // Find the resource
    this.findResource = function(){
        var self = this;
        this.db.collection('resources').findOne({"name" : self.name}, function (err, doc){
            var returnDoc = doc;
            if (err){
                // If error, send an error right away.
                self.sendResult(err, 500);
                return;
            } else {
                // If db query is a success, go through possibilities.
                if (doc == null){
                    // Resource does not exist.
                    self.sendResult(err, 404);
                    return;
                } else if (doc.leaseExpire < Date.now()){
                    // If the previous lease has expired, we are free to lease it to the requester.
                    // We also have to update it in our DB
                    var updateObj = {
                        name        : self.name,
                        leaseExpire : Date.now() + (self.leaseTime * 60 * 60 * 1000),
                        lastUsedBy  : self.req.body.lastUsedBy
                    };
                    self.db.collection('resources').update(
                        {"name" : self.name},
                        updateObj,
                        function(err, doc){
                            if (err){
                                self.sendResult(err, 500);
                                return;
                            } else {
                                self.sendResult(updateObj, 200);
                                return;
                            }
                        }
                    );
                    return;
                } else if (doc.leaseExpire > Date.now()){
                    // If the previous lease is still standing, this requester may not gain access until the first user's lease is up.
                    self.sendResult(doc, 423);
                    return;
                } else {
                    // Otherwise, we assume some freak error.
                    self.sendResult(doc, 500);
                    return;
                }
            }
        })
    };

    // Stringify the result so client can understand it.
    this.sendResult = function(result, status){
        res.status(status);
        res.send(JSON.stringify(result));
    };
}

module.exports = requestResourceController;
