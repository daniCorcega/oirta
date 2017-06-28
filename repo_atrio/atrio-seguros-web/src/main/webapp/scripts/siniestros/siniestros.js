'use strict';

angular.module('atrioApp.siniestros', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/siniestros', {
    templateUrl: 'siniestros/index.html',
    controller: 'SiniestrosCtrl'
  });
}])

.controller('SiniestrosCtrl', ['$scope', function($scope) {
	$scope.title = 'Siniestros';
	$scope.asegurado = {};
}]);