/* Add here all your JS customizations */
'use strict';

// Declare app level module which depends on views, and components
angular.module('atrioApp', [
  'ngRoute',
  'atrioApp.cotizadorVehiculo',
  'atrioApp.emision',
  'atrioApp.siniestros',
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/cotizador/vehiculo'});
}]);
