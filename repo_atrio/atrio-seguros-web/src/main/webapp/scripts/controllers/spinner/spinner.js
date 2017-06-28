define(['angular'], function (angular) {
    'use strict';
    var sessionControllers = angular.module('spinnerControllers',['angularSpinner']);
    
    sessionControllers.controller('spinnerCtr', ['$scope', 'usSpinnerService', 'llamadas', function($scope, usSpinnerService, llamadas) {
	$scope.spinContador = llamadas;
        usSpinnerService.spin('spinner-1');
        
        $scope.$watch('spinContador.acumuladas', function () {
            if ($scope.spinContador.acumuladas == 0) {
                usSpinnerService.stop('spinner-1');
            } else {
                usSpinnerService.spin('spinner-1');
            };
        });
                      
        $scope.activar = function () {
            usSpinnerService.spin('spinner-1');
        };
    }]);  
});
