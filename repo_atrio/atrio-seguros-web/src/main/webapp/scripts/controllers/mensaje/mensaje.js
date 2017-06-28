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
	    $scope.title= "Lamentablemente hemos encontrado una falla"
	    $scope.mensaje2 = "Existen problemas para cargar "+elemento+", por favor comunicarse con Sistemas o el área técnica";
	    //scope.mensaje2 = "Por favor intente cargar la pagina nuevamente."
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


   // TODO: Se agrega controlador para envio de documentos en zona de descarga

   mensajeControllers.controller('enviarDocumentoCtr', ['$scope', '$modal', '$modalInstance', 'zonadescargaService' ,'nombre', 'uri',
           function ($scope, $modal, $modalInstance, zonadescargaService, nombre ,uri) {
    $scope.email = "";

    $scope.enviar = function() {
      zonadescargaService.enviardocumento.execute({
        'nombre': nombre,
        'uri': uri,
        'email': $scope.email
      }, function (data) {
         return null
      }, function (response){
        mensaje.errorRed('Existe problemas para enviar el documento',reponse.status);
      });

               //};
  $modalInstance.dismiss('');
    };
    $scope.cerrar = function() {
  $modalInstance.dismiss('');
    };

 }]);

});
