define(['angular'], function (angular) {
    'use strict';
    var estaticasControllers = angular.module('estaticasControllers', ['ui.bootstrap']);

    estaticasControllers.controller('homeCtr', ['$scope', 'CotizadorVehiculoService', '$state', 'mensaje',
        function($scope, CotizadorVehiculoService, $state, mensaje){
            $scope.title = 'Inicio';
        }]);

    estaticasControllers.controller('DropdownCtrl', ['$scope',
        function($scope){
            $scope.status = {
                isopen: false
            };
            
            $scope.toggleDropdown = function($event) {
                $scope.status.isopen = !$scope.status.isopen;
            };
        }]);
});