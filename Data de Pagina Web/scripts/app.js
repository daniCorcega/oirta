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
    'porto.bootstrap.datepicker.spanish',
    'porto.bootstrap.maskedinput',
    'porto.jquery.ui',
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
     'cotizadorVehiculoControllers',
     'emisionVehiculoControllers',
     'siniestroControllers',
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
     'enterDirectives'
    ]).constant('API_PREFIX', '/atrio-rs/api/v1');

  return atrioApp;
});
