define (['angular'], function (angular) {
    'use strict';
    var mensajeControllers = angular.module('mensajeControllers', []);
    
    mensajeControllers.controller('mensajeCtr', ['$scope', '$modal', '$modalInstance', 'mensaje', 'recargar',
						 function ($scope, $modal, $modalInstance, mensaje, recargar) {
	    $scope.mensaje =mensaje
	    recargar = typeof recargar !== 'undefined' ? recargar : false;

	    $scope.cerrar = function() {
		if (recargar) {
		    location.reload();
		} else {
		    $modalInstance.dismiss('');
		}
	    }
    
	    
	 }]);

    mensajeControllers.controller('mensajeErrorRedCtr', ['$scope', '$modal', '$modalInstance', 'elemento', 'estado', 'recargar',
							 function ($scope, $modal, $modalInstance, elemento, estado, recargar) {
	    $scope.title = estado
	    $scope.mensaje = "No se logro cargar: "+elemento;
	    $scope.mensaje2 = "Por favor intente cargar la pagina nuevamente."
	    recargar = typeof recargar !== 'undefined' ? recargar : false;

	    $scope.cerrar = function() {
		if (recargar) {
		    location.reload();
		} else {
		    $modalInstance.dismiss('');
		}
	    };						    	    
	 }]);

    mensajeControllers.controller('enviarCotizacionCtr', ['$scope', '$modal', '$modalInstance', 'numSolicitud', 'nombre',
						 function ($scope, $modal, $modalInstance, numSolicitud, nombre) {
	    $scope.email = "";
               
	    $scope.enviar = function() {
                $.get("/atrio-web/api/v1/reports/send?nrosolicitud="+numSolicitud+"&email="+$scope.email+"&nombre="+nombre
                ,function(data,status){
                    return null;
                },function(data,status) {
                    return null;
                });
		$modalInstance.dismiss('');
	    };                                  
	    $scope.cerrar = function() {
		$modalInstance.dismiss('');
	    };    
                                                     
	 }]); 
});
