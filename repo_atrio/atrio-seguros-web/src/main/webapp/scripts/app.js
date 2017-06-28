define([
   'angular',
    'jquery',
    'jquery.maskmoney',
    'angular.route',
    'angular.uiRouter',
    'angular.resource',
    'angular.bootstrap',
    'jquery.bootstrap',
    'ng-table',
    'ng-idle',
    'porto.bootstrap',
    'porto.jquery',
    'porto.jquery.appear',
    'porto.jquery.validate',
    'porto.theme',
    'porto.theme.init',
    'porto.messages_es',
    'porto.jquery.bootstrap-wizard',
    'porto.pnotify',
    'porto.bootstrap.datepicker',
    'porto.bootstrap.timepicker',
    'porto.bootstrap.datepicker.spanish',
    'porto.bootstrap.maskedinput',
    'porto.jquery.ui',
    'spin',
    'angular.spinner',
    './controllers/index',
    './directives/index',
    './services/index',
    './filters/utils'
], function (ng) {
    'use strict';
    var atrioApp = ng.module('atrioApp', [
     'ngResource',
     'ngRoute',
     'ui.router',
     'ngTable',
     'usuarioControllers',
     'sessionControllers',
     //'personaControllers',
     //'proveedorControllers',
     'zonadescargaControllers',
     'cotizadorVehiculoControllers',
     'emisionVehiculoControllers',
     'siniestroControllers',
     'spinnerControllers',
     'atrioFilters',
     'urlServices',
     'custoMaskMoney',
     'numeros',
     'cambioFondo',
     'templates',
     'ui.bootstrap',
     'utilServices',
     'mensajeControllers',
     'estaticasControllers',
     'efectoDirectives',
     'capitalizarDirectives',
     'enterDirectives',
     'ngIdle',
     'angularSpinner'
    ]).constant('API_PREFIX', '/atrio-rs/api/v1');

    atrioApp.config(function(IdleProvider, KeepaliveProvider) {
        IdleProvider.idle(4*60*59); // in seconds
        IdleProvider.timeout(4*60*60); // in seconds
        KeepaliveProvider.interval(2); // in seconds
    });

    atrioApp.config(function ($provide) {
	$provide.decorator('$uiViewScroll', function ($delegate) {
	    return function (uiViewElement) {
		$("html, body").animate({ scrollTop: -150 }, "slow");
		window.scrollTo(0, -150);
	    };
	});
    });

    atrioApp.config(['usSpinnerConfigProvider', function (usSpinnerConfigProvider) {
        usSpinnerConfigProvider.setDefaults({color: '#3158A9'});
    }]);

    atrioApp.run(function(Idle){
        // start watching when the app runs. also starts the Keepalive service by defautl.
	Idle.watch();
    });

    atrioApp.config(function ($httpProvider) {
	$httpProvider.interceptors.push('spinnerInterceptor');
    });

    atrioApp.factory('spinnerInterceptor', ['$injector', 'llamadas', function ($injector, llamadas) {

	var spinner = {
	    request: function(config) {
		var x = $injector.get('llamadas');
		x.acumuladas = x.acumuladas == undefined ? 1 : x.acumuladas + 1;
		return config;
	    },
	    response: function(config) {
		var x = $injector.get('llamadas');
		x.acumuladas = x.acumuladas - 1;
		return config;
	    },
            responseError: function (config) {
	        var x = $injector.get('llamadas');
                var $modal = $injector.get('$modal');
                var mensaje = $injector.get('mensaje');
                x.acumuladas = x.acumuladas - 1;
                var url = config.config.url.split("/");
                var nombre = url[url.length-1];
                mensaje.errorRed(nombre,500,true);
                return config;
            }
	};
	return spinner;
    }]);

  return atrioApp;
});
