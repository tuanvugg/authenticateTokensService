var myApp = angular.module('wsApp', []);
myApp.controller('wsController', ['$scope', '$http', function($scope, $http) {
    console.log("Hello World from controller");
$scope.addImage = function() {
  console.log($scope.user);
  $http.post('api/authenticate',$scope.user).success(function(response) {
    console.log(response);
  });
};
}]);﻿


 
// Mã hóa
