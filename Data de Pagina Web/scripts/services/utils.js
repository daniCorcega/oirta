define(['angular'], function(angular){
    'use strict';
    var utilServices = angular.module('utilServices', []);
    
    utilServices.factory('transform', [ 
        function(){
        return {
            stringToInt: function(value){
                if(!angular.isNumber(value)){
                    var valueInt = parseInt(value.trim());
                    if(valueInt == NaN){
                        console.log('Problem to convert '+value+' to string');
                        return '';
                    }
                    return valueInt;
                }
            }
        };
    }]);

    utilServices.factory('emitirCotizacion', [ 
        function(){
            return {};
        }
    ]);

    utilServices.factory('mensaje', ["$modal", function ($modal) {
	return {
	    error: function (mensaje, recargar) {
		$modal.open({
		    templateUrl: 'views/mensaje/errorMensaje.html',
		    controller:'mensajeCtr',
		    backdrop: 'static',
		    resolve: {
			mensaje: function () {
			    return mensaje;
			},
			recargar: function () {
			    return recargar;
			}
		    }
		});
	    },
	    exito: function (mensaje, recargar) {
		$modal.open({
		    templateUrl: 'views/mensaje/exitoMensaje.html',
		    controller:'mensajeCtr',
		    backdrop: 'static',
		    resolve: {
			mensaje: function () {
			    return mensaje;
			},
			recargar: function () {
			    return recargar;
			}
		    }
		});
	    },
	    info: function (mensaje, recargar) {
		$modal.open({
		    templateUrl: 'views/mensaje/infoMensaje.html',
		    controller:'mensajeCtr',
		    backdrop: 'static',
		    resolve: {
			mensaje: function () {
			    return mensaje;
			},
			recargar: function () {
			    return recargar;
			}
		    }
		});
	    },
	    adver: function (mensaje, recargar) {
		$modal.open({
		    templateUrl: 'views/mensaje/adverMensaje.html',
		    controller:'mensajeCtr',
		    backdrop: 'static',
		    resolve: {
			mensaje: function () {
			    return mensaje;
			},
			recargar: function () {
			    return recargar;
			}
		    }
		});
	    },
	    enviarCotizacion: function(numSolicitud, nombre) {
		$modal.open({
		    templateUrl: 'views/mensaje/enviarCotizacion.html',
		    controller:'enviarCotizacionCtr',
		    backdrop: 'static',
		    resolve: {
			numSolicitud: function () {
			    return numSolicitud;
			},
			nombre: function () {
			    return nombre;
                        }
		    }
		});
	    },
	    errorRed: function(elemento, estado, recargar) {
		$modal.open({
		    templateUrl: 'views/mensaje/errorMensaje.html',
		    controller:'mensajeErrorRedCtr',
		    backdrop: 'static',
		    resolve: {
			elemento: function () {
			    return elemento;
			},
			estado: function () {
			    return estado;
			},
			recargar: function () {
			    return recargar;
			}
		    }
		});
	    }
	};
    }]);

});
