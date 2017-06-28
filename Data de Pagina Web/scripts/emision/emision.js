'use strict';

angular.module('atrioApp.emision', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/emision', {
    templateUrl: 'emision/index.html',
    controller: 'EmisionCtrl'
  });
}])

.controller('EmisionCtrl', ['$scope', function($scope) {
	$scope.title = 'Emisión';
}]);