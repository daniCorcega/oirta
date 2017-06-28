define(['./app'], function(atrioApp) {
  'use strict';
  return atrioApp.config(['$stateProvider', '$urlRouterProvider', '$locationProvider',
     'API_PREFIX',
    function ($stateProvider, $urlRouterProvider, $locationProvider,
      API_PREFIX){
       //$locationProvider.html5Mode(true);
       $urlRouterProvider.otherwise("/");

       /*********************/
       /***   ESTATICAS   ***/
       /*********************/
       $stateProvider
         .state('home', {
             url: '/',
             templateUrl: "views/estaticas/home.html",
             controller: "homeCtr"
         });

       /*********************/
       /***   COTIZADOR   ***/
       /*********************/
        $stateProvider
          .state('cotizaciones', {
            url:'/cotizacion/lista',
            templateUrl: "views/cotizador/vehiculo/lista.html",
            controller: "CotizadorVehiculoListaCtr"            
        });

       $stateProvider
         .state('cotizadorvehiculo', {
             url: '/cotizacion/vehiculo',
             templateUrl: "views/cotizador/vehiculo/wizard.html",
             controller: "CotizadorVehiculoCtr"
         })
         .state('cotizadorvehiculo.solicitante', {
             templateUrl: "views/cotizador/vehiculo/solicitante.html",
             controller: "CotizadorVehiculoSolicitanteCtr"
         })
         .state('cotizadorvehiculo.vehiculo', {
             url: '',
             templateUrl: "views/cotizador/vehiculo/vehiculo.html",
             controller: "CotizadorVehiculoDatosVehiculoCtr"
         })
         .state('cotizadorvehiculo.pago', {
             url: '',
             templateUrl: "views/cotizador/vehiculo/pago.html",
             controller: "CotizadorVehiculoPagoCtr"
         })
         .state('cotizadorvehiculo.planes', {
             url: '',
             templateUrl: "views/cotizador/vehiculo/planes.html",
             controller: "CotizadorVehiculoPlanesCtr"
         })
         .state('cotizadorvehiculo.resumen', {
             url: '',
             templateUrl: "views/cotizador/vehiculo/resumen.html",
             controller: "CotizadorVehiculoResumenCtr"
         });

    }]);
});
