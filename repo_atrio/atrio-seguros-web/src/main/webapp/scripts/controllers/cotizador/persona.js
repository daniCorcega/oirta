define(['angular'], function (angular) {
    'use strict';
    var personaControllers = angular.module('personaControllers', ['ui.bootstrap']);

    personaControllers.controller('CotizadorPersonaCtr', ['$scope', 'CotizadorPersonaService', '$state', 'mensaje',
        function($scope, CotizadorPersonaService, $state, mensaje){
            $scope.title = 'Inicio';

	    CotizadorPersonaService.usuarioActual.execute({
          },function (data) {
               $scope.usuario = data;
          }, function (response) {
                mensaje.errorRed('Cargando Usuario',response.status);
          });

}]);

    //estaticasControllers.controller('home2Ctr', ['$scope', '$state', 'mensaje',
      //  function($scope,$state, mensaje){
        //    $scope.title = 'Inicio';


          //  $scope.mostrarproveedor = function () {
            //    var mostrar = $scope.usuario ? $.inArray("PROVEEDOR",$scope.usuario.roles) : -1;
              //  return mostrar;
           // };
        //}]);



});
