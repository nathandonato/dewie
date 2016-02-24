// public/dewie.js
var dewie = angular.module('dewie', []);
    $scope.requestData = {};

    function mainController($scope, $http){
        $scope.requestResource = function(){
            $http.post("/requestResource", $scope.requestData)
                .success(fuction(data){
                    //
                })
                .error(function)(data){
                    //
                })
        }
    }
}