define(['angular'], function (angular) {
    'use strict';
    var estaticasControllers = angular.module('estaticasControllers', ['ui.bootstrap']);

    estaticasControllers.controller('homeCtr', ['$scope', 'CotizadorVehiculoService', '$state', 'mensaje',
        function($scope, CotizadorVehiculoService, $state, mensaje){
            $scope.title = 'Inicio';

	    CotizadorVehiculoService.usuarioActual.execute({
            },function (data) {
                $scope.usuario = data;
            }, function (response) {
                mensaje.errorRed('Cargando Usuario',response.status);
            });

            $scope.mostrarEmisor = function () {
                var mostrar = $scope.usuario ? $.inArray("EMISOR",$scope.usuario.roles) : -1;
                return mostrar;
            };
        }]);

   // estaticasControllers.controller('home2Ctr', ['$scope', '$state', 'mensaje',
     //   function($scope,$state, mensaje){
       //     $scope.title = 'Inicio';


         //   $scope.mostrarproveedor = function () {
           //     var mostrar = $scope.usuario ? $.inArray("PROVEEDOR",$scope.usuario.roles) : -1;
             //   return mostrar;
            //};
        //}]);

    estaticasControllers.controller('DropdownCtrl', ['$scope', 'CotizadorVehiculoService',
        function($scope, CotizadorVehiculoService){
            $scope.status = {
                isopen: false
            };
  CotizadorVehiculoService.usuarioActual.execute({
                  },function (data) {
                      $scope.usuario = data;
                  }, function (response) {
                      mensaje.errorRed('Cargando Usuario',response.status);
                  });

            $scope.toggleDropdown = function($event) {
                $scope.status.isopen = !$scope.status.isopen;
            };
        }]);
});
