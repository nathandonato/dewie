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

    // These are the endpoints the user or admin will hit
    $scope.verbResource = {
        // Data that we will send
        data : function(){
            return {
                name       : $scope.resourceSearch.value,
                lastUsedBy : $scope.userName.value
            };
        },
        // /addResource
        add : function(){
            if (!$scope.verifyInputs()){
                return;
            }
            $http.post("/addResource", $scope.verbResource.data())
                .success(function(response){
                    $scope.adminSuccess = true;
                    $scope.resourceSearch.value = "";
                    $($scope.userName).removeClass("badinput");
                    $($scope.resourceSearch).removeClass("badinput");
                })
                .error(function(response){
                    $($scope.userName).removeClass("badinput");
                    $($scope.resourceSearch).removeClass("badinput");
                    alert("Failed to add resource. See the console for more details.");
                    console.log(JSON.stringify(response));
                    $scope.adminSuccess = false;
                })
        },
        // /requestResource
        request : function(){
            if (!$scope.verifyInputs()){
                return;
            }
            $http.post("/requestResource", $scope.verbResource.data())
                // User has successfully leased the resource
                .success(function(response){
                    $($scope.userName).removeClass("badinput");
                    $($scope.resourceSearch).removeClass("badinput");
                    var expiration = new Date(response.leaseExpire).toString();
                    alert("You now have access to the resource: '" + response.name + "'\nYour lease expires at this time: " + expiration);                     
                })
                // Something went wrong. Handle possibilities here.
                .error(function(err){
                    $($scope.userName).removeClass("badinput");
                    $($scope.resourceSearch).removeClass("badinput");
                    if (err == "null"){
                        alert("Resource does not exist.");
                    } else if (err.leaseExpire !== undefined) {
                        var expiration = new Date(err.leaseExpire).toString();
                        alert("A lease already exists for that resource.\nIt expires at this time: " + expiration);
                    } else {
                        alert("Database issue.\nTry restarting MongoDB.");
                    }
                })
        }
    };

    // Remind user to enter necessary data
    $scope.verifyInputs = function(){
        if ($scope.userName.value == ""){
            $($scope.userName).addClass("badinput");
            alert("Please enter your name.");
            return false;
        }

        if ($scope.resourceSearch.value == ""){
            $($scope.resourceSearch).addClass("badinput");
            alert("Please enter a resource name.");
            return false;
        }

        return true;
    }

    // This is the autocomplete function.
    // It is wrapped in a timeout in case we want to only seek results
    // after the user has finished typing for several hundred milliseconds.
    // The purpose of this would be to lessen the number of requests.
    // Since we're only concerned about demonstration and not performance, I've set it to zero.
    var timeoutId;
    var timeoutLength = 0;
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
        }, timeoutLength);
    }

    $scope.viewAutocompleteResults = function(response){
        // Populates autocomplete results
        $scope.autocompleteResults = response;
    }

    $scope.autopopulate = function(val){
        // Clicking the autocomplete results will fill search bar
        $scope.resourceSearch.value = val;
        $scope.autocomplete();
    }

    $scope.switchContext = function(context){
        // Switch UI to cater to either admin or user
        $scope.context = $scope.contexts[context];
        $scope.adminSuccess = false;
        $($scope.userName).removeClass("badinput");
        $($scope.resourceSearch).removeClass("badinput");
    }

    // Initialize default data
    $scope.switchContext("user");
}]);
