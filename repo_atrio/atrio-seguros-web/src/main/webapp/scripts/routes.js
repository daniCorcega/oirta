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
             controller: "homeCtr",

        //onEnter : function ($state,ComunService){
         //ComunService.usuarioActual.execute({
         //},function (data) {
          //   var usuario = data;
            // var mostrar = usuario ? $.inArray("PROVEEDOR",usuario.roles) : 1;
            // if (mostrar == 3) {
            // $state.go('home2');
            // } else {
            //  $state.go('home');
         //}

        // });
         //}

        // })
        //.state('home2', {
          //   url: '/persona',
            // templateUrl: "views/persona/home.html",
            // controller: "2Ctr",

         })

         /*********************/
         /***    Persona   ***/
         /*********************/
        /* $stateProvider
           .state('persona', {
               url: '/cotizacion/persona',
               templateUrl: "views/cotizador/persona/home.html",
               controller: "CotizadorPersonaCtr"
           })
*/

       /*********************/
       /***   Proveedor  ***/
       /*********************/
/*       $stateProvider
         .state('proveedor', {
             url: '/proveedor/consulta',
             templateUrl: "views/proveedor/consulta/consulta.html",
             controller: "ConsultaProveedorCtr"
         })
*/
       /*********************/
       /***    USUARIOS   ***/
       /*********************/
       $stateProvider
         .state('clave_cambiar', {
             url: '/usuario/clave/cambiar',
             templateUrl: "views/usuario/cambiar_clave.html",
             controller: "usuarioCambiarClaveCtr"
         })
         /*
         .state('datos_actualizar', {
             url: '/usuario/clave/actualizar',
             templateUrl: "views/usuario/actualizar_datos.html",
             controller: "usuarioActualizarCtr"
         })
         */
         .state('clave_regenerar', {
             url: '/usuario/clave/regenerar',
             templateUrl: "views/usuario/recuperar_clave.html",
             controller: "usuarioRegenerarClaveCtr"
         });

       /*********************/
       /***   COTIZADOR   ***/
       /*********************/
        $stateProvider
            .state('cotizaciones', {
            url:'/cotizacion/lista',
            templateUrl: "views/cotizador/vehiculo/misCotizaciones.html",
            controller: "CotizadorVehiculoMisCotizacionesCtr"
        });

        $stateProvider
          .state('cotizacionesTodas', {
            url:'/cotizacion/todas',
            templateUrl: "views/cotizador/vehiculo/todasCotizaciones.html",
            controller: "CotizadorVehiculoTodasCotizacionesCtr"
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

       /*********************/
       /***    EMISION    ***/
       /*********************/

       $stateProvider
         .state('emisionvehiculotodas', {
            url: '/emision/lista',
            templateUrl: "views/emision/vehiculo/todasemisiones.html",
            controller: "EmisionVehiculoEmisionesCtr"
       });

       $stateProvider
          .state('emisionvehiculoTodas', {
            url:'/emision/todas',
            templateUrl: "views/emision/vehiculo/emisionestodas.html",
            controller: "EmisionVehiculoTodasEmisionesCtr"
        });

       $stateProvider
         .state('emisionvehiculo', {
             url: '/emision/vehiculo',
             templateUrl: "views/emision/vehiculo/wizard.html",
             controller: "EmisionVehiculoCtr",
	     onEnter : function ($state,ComunService){
		 ComunService.usuarioActual.execute({
		 },function (data) {
		     var usuario = data;
		     var mostrar = usuario ? $.inArray("EMISOR",usuario.roles) : -1;
		     if (mostrar < 0) {
			 $state.go('home');
		     }
		 }, function (data) {
		     $state.go('home');
		 });
	     }
     })
         .state('emisionvehiculo.cotizaciones', {
             templateUrl: "views/emision/vehiculo/cotizaciones.html",
             controller: "EmisionVehiculoCotizacionesCtr"

         })
         .state('emisionvehiculo.vehiculo', {
             url: '',
             templateUrl: "views/emision/vehiculo/vehiculo.html",
             controller: "EmisionVehiculoVehiculoCtr"
         })
         .state('emisionvehiculo.cliente', {
             url: '',
             templateUrl: "views/emision/vehiculo/cliente.html",
             controller: "EmisionVehiculoClienteCtr"
         })
         .state('emisionvehiculo.tomador', {
             url: '',
             templateUrl: "views/emision/vehiculo/tomador.html",
             controller: "EmisionVehiculoTomadorCtr"
         })
         .state('emisionvehiculo.conductores', {
             url: '',
             templateUrl: "views/emision/vehiculo/conductores.html",
             controller: "EmisionVehiculoConductoresCtr"
         })
         .state('emisionvehiculo.pago', {
             url: '',
             templateUrl: "views/emision/vehiculo/pago.html",
             controller: "EmisionVehiculoPagoCtr"
         })
         .state('emisionvehiculo.requisitos', {
             url: '',
             templateUrl: "views/emision/vehiculo/requisitos.html",
             controller: "EmisionVehiculoRequisitosCtr"
         })
         .state('emisionvehiculo.requisitoss', {
             url: '',
             templateUrl: "views/emision/vehiculo/requisitos.html",
             controller: "EmisionVehiculoRequisitossCtr"
         })
         .state('emisionvehiculo.resumen', {
             url: '',
             templateUrl: "views/emision/vehiculo/resumen.html",
             controller: "EmisionVehiculoResumenCtr"
         })
         .state('emisionvehiculo.resultado', {
             url: '',
             templateUrl: "views/emision/vehiculo/resultado.html",
             controller: "EmisionVehiculoResultadoCtr"
         });


        /********************/
       /***  Zonadescarga  ****/
       /********************/
         $stateProvider
           .state('zonadescarga', {
               url: '/zonadescarga/zonadescarga',
               templateUrl: "views/zonadescarga/zonadescarga.html",
               controller: "ZonadescargaCtr"
           })


         /********************/
       /***  SINIESTRO  ****/
       /********************/
        $stateProvider
          .state('siniestros', {
            url:'/siniestro/lista',
            templateUrl: "views/siniestro/lista.html",
            controller: "SiniestroListaCtr"
        });

       $stateProvider
         .state('siniestro', {
             url: '/siniestro',
             templateUrl: "views/siniestro/wizard.html",
             controller: "SiniestroWizardCtr"
         })
         .state('siniestro.vehiculo', {
             templateUrl: "views/siniestro/vehiculo.html",
             controller: "SiniestroVehiculoCtr"
         })
         .state('siniestro.titular', {
             templateUrl: "views/siniestro/titular.html",
             controller: "SiniestroTitularCtr"
         })
         .state('siniestro.conductor', {
             templateUrl: "views/siniestro/conductor.html",
             controller: "SiniestroConductorCtr"
         })
         .state('siniestro.danos', {
             templateUrl: "views/siniestro/danos.html",
             controller: "SiniestroDanosCtr"
         })
         .state('siniestro.taller', {
             templateUrl: "views/siniestro/taller.html",
             controller: "SiniestroTallerCtr"
         })
         .state('siniestro.resumen', {
             templateUrl: "views/siniestro/resumen.html",
             controller: "SiniestroResumenCtr"
         })
         .state('siniestro.resultado', {
             templateUrl: "views/siniestro/resultado.html",
             controller: "SiniestroResultadoCtr"
         });
    }]);
});
