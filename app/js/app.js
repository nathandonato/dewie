//app.js

var dewie = angular.module('dewie', []);

dewie.controller('mainController', ['$scope', '$http', function ($scope, $http){
    // Set up some preliminary data on $scope
    $scope.requestData = {};
    $scope.autocompleteResults = [];
    $scope.resourceSearch = document.getElementsByName("resourceSearch")[0];
    $scope.userName = document.getElementsByName("userName")[0];
    $scope.adminSuccess = false;

    // This data will change based on user context
    $scope.contexts = {
        "user" : {
            "greeting"     : "Welcome, User.",
            "instructions" : "Type the name of the resource you'd like to request.",
            "reader"       : "Adminstrators",
            "context"      : "admin",
            "switchVerb"   : "add",
            "submitVerb"   : "request",
            "formUrl"      : "/requestResource"
        },
        "admin" : {
            "greeting"     : "Welcome, Adminstrator.",
            "instructions" : "Type the name of the resource you'd like to add to the database.",
            "reader"       : "Users",
            "context"      : "user",
            "switchVerb"   : "request",
            "submitVerb"   : "add",
            "formUrl"      : "/addResource"
        }
    };

    // Determine which endpoint to hit depending on which user context we are in.
    $scope.verbResource = {
        data : function(){
            return {
                name       : $scope.resourceSearch.value,
                lastUsedBy : $scope.userName.value
            };
        },
        add : function(){
            if (!$scope.verifyInputs()){
                return;
            }
            $http.post("/addResource", $scope.verbResource.data())
                .success(function(response){
                    $scope.adminSuccess = true;
                    $scope.resourceSearch.value = "";
                })
                .error(function(response){
                    console.log(response);
                })
        },
        request : function(){
            if (!$scope.verifyInputs()){
                return;
            }
            $http.post("/requestResource", $scope.verbResource.data())
                .success(function(response){
                    console.dir(response);
                    alert("You now have access to the resource: '" + response.name + "'\n Lease expires in 2 hours.");                     
                })
                .error(function(err){
                    if (err == "null"){
                        alert("Hmm, we don't have a record of that resource in our system.");
                    } else if (err.leaseExpire !== undefined) {
                        var expiration = new Date(err.leaseExpire);
                        alert("Someone else already has a lease on that resource.\nTheir lease expires at this time: " + expiration.toString());
                    } else {
                        alert("Something went horribly wrong.");
                    }
                })
        }
    };

    // Remind user to enter necessary data
    $scope.verifyInputs = function(){
        if ($scope.userName.value == ""){
            $scope.userName.style.border = "2px solid red";
            alert("Please enter your name.");
            return false;
        }

        if ($scope.resourceSearch.value == ""){
            $scope.resourceSearch.style.border = "2px solid red";
            alert("Please enter a resource name.");
            return false;
        }

        return true;
    }

    // This is the autocompete function.
    // It is wrapped in a timeout in case we want to only seek results
    // after the user has finished typing for several hundred milliseconds.
    // The purpose of this would be to lessen the number of requests.
    var timeoutId;
    $scope.autocomplete = function(){
        clearTimeout(timeoutId);
        $scope.adminSuccess = false;        
        timeoutId = setTimeout(function() {
            var data = {"string" : $scope.resourceSearch.value};
            $http.post("/autocomplete", data)
                .success(function (response) {
                    $scope.viewAutocompleteResults(response);
                })
                .error(function (response) {
                    console.log("Failed to get autocomplete data.")
                });
        }, 0);
    }

    $scope.viewAutocompleteResults = function(response){
        // Populates autocomplte results
        $scope.autocompleteResults = response;
    }

    $scope.autopopulate = function(val){
        // Clicking the autocomplete results will fill search bar
        $scope.resourceSearch.value = val;
        $scope.autocomplete();
    }

    $scope.switchContext = function(context){
        // Switch UI depending if it's a user or an admin
        $scope.context = $scope.contexts[context];
        $scope.adminSuccess = false;
    }

    // Initialize default data
    $scope.switchContext("user");
}]);