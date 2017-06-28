define(['angular'], function (angular) {
    'use strict';
    var zonadescargaControllers = angular.module('zonadescargaControllers', ['ngTable']);

   zonadescargaControllers.controller('ZonadescargaCtr', ['$state', '$scope', 'zonadescargaService','ngTableParams', '$filter','mensaje',
        function ($state, $scope, zonadescargaService, ngTableParams ,$filter, mensaje) {

$scope.status = {
    isFirstOpen: true,
    oneAtATime: true
  };
	    $scope.cargado = 0;

	    $scope.cargado = 1;
            zonadescargaService.documentos.execute({
            }, function (data) {
		$scope.cargado =  2;
                $scope.documentos = data.documentos_cur;
                jQuery.map($scope.documentos,function (documento, i) {
                    $scope.documentos[i].nombre = documento.nombre;
                    $scope.documentos[i].fechact = documento.fecha;
                    $scope.documentos[i].uri = documento.uri;
                    $scope.documentos[i].grupo = documento.grupo;
                    $scope.documentos[i].icon = documento.icon;

                  });
		$scope.cargado = 3;
                $scope.tableParams = new ngTableParams({
                    group: "grupo",
                    filter: {
                    }
                }, {
                    total: $scope.documentos.length, // length of data
                    getData: function($defer, params) {
                        var filteredData = params.filter() ?
                                $filter('filter')($scope.documentos, params.filter()) : $scope.documentos;

                        var orderedData = params.sorting() ?
                                $filter('orderBy')(filteredData, params.orderBy()) : filteredData;

                        params.total(orderedData.length);
                        $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                    }
                });
            }, function (response) {
                mensaje.errorRed('Cargando Cotizaciones',response.status);
            });


 $scope.enviarDocumento = function(nombre,uri){
   mensaje.enviarDocumento(nombre,uri);
 };
        }]);
});
