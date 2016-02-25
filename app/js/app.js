//app.js

var dewie = angular.module('dewie', []);

dewie.controller('mainController', ['$scope', '$http', function ($scope, $http){
    $scope.requestData = {};
    $scope.autocompleteResults = [];
    $scope.resourceSearch = document.getElementsByName("resourceSearch")[0];
    $scope.userName = document.getElementsByName("userName")[0];

    // This data will change based on user context
    $scope.contexts = {
        "user" : {
            "greeting"     : "Welcome, Users.",
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
            "reader"       : "User",
            "context"      : "user",
            "switchVerb"   : "request",
            "submitVerb"   : "add",
            "formUrl"      : "/addResource"
        }
    };

    // Change endpoint depending on which user context we are in.
    $scope.verbResource = function(verb){
        var url  = "/" + $scope.context.submitVerb + "Resource";

        // Remind user to enter necessary data
        if ($scope.userName.value == ""){
            $scope.userName.style.border = "2px solid red";
            alert("Please enter your name.");
            return;
        }

        if ($scope.resourceSearch.value == ""){
            $scope.resourceSearch.style.border = "2px solid red";
            alert("Please enter a resource name.");
            return;
        }
        var data = {
            "name"       : $scope.resourceSearch.value,
            "lastUsedBy" : $scope.userName.value,
        };

        $http.post(url, data)
            .success(function(response){
                console.log(response);
            })
            .error(function(response){
                console.log(response);
            })
    }

    var timeoutId;
    $scope.autocomplete = function(){
        clearTimeout(timeoutId);
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
        $scope.autocompleteResults = response;
    }

    $scope.autopopulate = function(val){
        $scope.resourceSearch.value = val;
        $scope.autocomplete();
    }

    $scope.switchContext = function(context){
        $scope.context = $scope.contexts[context];
    }

    // Initialize default data
    $scope.switchContext("user");
}]);