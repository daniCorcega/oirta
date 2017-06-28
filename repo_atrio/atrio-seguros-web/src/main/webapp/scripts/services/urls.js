define(["angular"], function(angular){
    "use strict";
    var urlServices = angular.module("urlServices", ["ngResource"]);

     urlServices.factory("UsuarioService", ["$resource", "API_PREFIX",
     function($resource, API_PREFIX){
         return {
             cambiarClave: $resource("/atrio-web/api/v1/users/change-password", {}, {
                execute: {
                    method: "POST"
                }
            })
         };
     }]);

    urlServices.factory("CotizadorVehiculoService", ["$resource", "API_PREFIX",
    function($resource, API_PREFIX){
        return {
            tercero: $resource("/atrio-web/api/v1/data/comun/terceros", {}, {
                execute: {method: "POST"}
            }),
            anio: $resource("/atrio-web/api/v1/data/vehiculo/anios", {}, {
                execute: {method: "POST"}
            }),
            marca:$resource("/atrio-web/api/v1/data/vehiculo/marcas", {}, {
                execute: {method: "POST"}
            }),
            modelo: $resource("/atrio-web/api/v1/data/vehiculo/modelos", {}, {
                execute: {method: "POST"}
            }),
            version: $resource("/atrio-web/api/v1/data/vehiculo/versiones", {}, {
                execute: {method: "POST"}
            }),
            estado: $resource("/atrio-web/api/v1/data/comun/estados", {}, {
                execute: {method: "POST"}
            }),
            codArea: $resource("/atrio-web/api/v1/data/comun/codareas", {}, {
                execute: {method: "POST"}
            }),
            cotizacionSolicitante: $resource("/atrio-web/api/v1/data/cotizacion/guardar-solicitante", {}, {
                execute: {method: "POST"}
            }),
            cotizacionVehiculo: $resource("/atrio-web/api/v1/data/cotizacion/guardar-vehiculo", {}, {
                execute: {method: "POST"}
            }),
            planes: $resource("/atrio-web/api/v1/data/cotizacion/planes", {}, {
                execute: {method: "POST"}
            }),
            cobertura: $resource("/atrio-web/api/v1/data/cotizacion/coberturas", {}, {
                execute: {method: "POST"}
            }),
            coberturasAdicionales: $resource("/atrio-web/api/v1/data/cotizacion/coberturas-adicionales", {}, {
                execute: {method: "POST"}
            }),
            tarificarCoberturasAdicionales: $resource("/atrio-web/api/v1/data/cotizacion/tarificar-coberturas-adicionales", {}, {
                execute: {method: "POST"}
            }),
            descuento: $resource("/atrio-web/api/v1/data/cotizacion/descuentos", {}, {
                execute: {method: "POST"}
            }),
           guardarDescuento: $resource("/atrio-web/api/v1/data/cotizacion/guardar-descuento", {}, {
                execute: {method: "POST"}
            }),

            financiamiento: $resource("/atrio-web/api/v1/data/cotizacion/financiamientos", {}, {
                execute: {method: "POST"}
            }),
            pago: $resource("/atrio-web/api/v1/data/cotizacion/pagos", {}, {
                execute: {method: "POST"}
            }),
            porcentajes: $resource("/atrio-web/api/v1/data/cotizacion/porcentajes", {}, {
                execute: {method: "POST"}
            }),
            financiamientoPlanes: $resource("/atrio-web/api/v1/data/cotizacion/financiamiento-planes", {}, {
                execute: {method: "POST"}
            }),
            financiamientoCalculo: $resource("/atrio-web/api/v1/data/cotizacion/financiamiento-calculo", {}, {
                execute: {method: "POST"}
            }),
            calculoFinanciamiento: $resource("/atrio-web/api/v1/data/cotizacion/calculo-plan", {}, {
                execute: {method: "POST"}
            }),
            guardarFinanciamiento: $resource ("/atrio-web/api/v1/data/cotizacion/guardar-financiamiento", {}, {
                execute: {method: "POST"}
            }),
            cotizacionCobertura: $resource ("/atrio-web/api/v1/data/cotizacion/guardar-coberturas2", {}, {
                execute: {method: "POST"}
            }),
            misCotizaciones: $resource("/atrio-web/api/v1/data/cotizacion/mis-cotizaciones", {}, {
                execute: {method: "POST"}
            }),
            todasCotizaciones: $resource("/atrio-web/api/v1/data/cotizacion/todas-cotizaciones", {}, {
                execute: {method: "POST"}
            }),
            usuarioActual: $resource("/atrio-web/api/v1/users/current", {}, {
                execute: {method: "POST"}
            }),
            intermediarios: $resource("/atrio-web/api/v1/data/comun/intermediarios", {}, {
                execute: {method: "POST"}
            }),
            planesreservas: $resource("/atrio-web/api/v1/data/cotizacion/planes-reservas", {}, {
                execute: {method: "POST"}
            }),
            planesmaliciosos: $resource("/atrio-web/api/v1/data/cotizacion/planes-maliciosos", {}, {
                execute: {method: "POST"}
            }),
            deducible: $resource("/atrio-web/api/v1/data/cotizacion/deducible", {}, {
                execute: {method: "POST"}
            }),
            validaSumaEspecial: $resource("/atrio-web/api/v1/data/cotizacion/valida-suma-especial", {}, {
                execute: {method: "POST"}
            })
        };
    }]);
/*
    urlServices.factory("ProveedorService", ["$resource", "API_PREFIX",
    function($resource, API_PREFIX){
        return {
            consulta: $resource("/atrio-web/api/v1/data/proveedor/mis-facturas", {}, {
                execute: {method: "POST"}
            }),
            retencion: $resource("/atrio-web/api/v1/data/proveedor/retenciones", {}, {
                execute: {method: "POST"}
            }),

         };
     }]);
*/

  //Agregado para el servicio de Zona de Descarga//
    urlServices.factory("zonadescargaService", ["$resource", "API_PREFIX",
    function($resource, API_PREFIX){
        return {
            documentos: $resource("/atrio-web/api/v1/data/zona/devuelve-documentos", {}, {
                execute: {method: "POST"}
            }),
            enviardocumento: $resource("/atrio-web/api/v1/data/zona/enviar-documento",{},{
                execute: {method: "POST"}
            }),
         };
     }]);
    //Fin Zona de descarga

     urlServices.factory("CotizadorPersonaService", ["$resource", "API_PREFIX",
     function($resource, API_PREFIX){
         return {
             usuarioActual: $resource("/atrio-web/api/v1/users/current", {}, {
               execute: {method: "POST"}
             }),


          };
      }]);


    urlServices.factory("EmisionVehiculoService", ["$resource", "API_PREFIX",
    function($resource, API_PREFIX){
        return {
            misCotizaciones: $resource("/atrio-web/api/v1/data/cotizacion/mis-cotizaciones-activas", {}, {
                execute: {method: "POST"}
            }),
            todasCotizaciones: $resource("/atrio-web/api/v1/data/cotizacion/todas-cotizaciones-activas", {}, {
                execute: {method: "POST"}
            }),
            devuelveemisiones: $resource("/atrio-web/api/v1/data/emision/devuelve-emisiones", {}, {
                execute: {method: "POST"}
            }),
            devuelvetodasemisiones: $resource("/atrio-web/api/v1/data/emision/devuelve-todas-emisiones", {}, {
                execute: {method: "POST"}
            }),
            validaReaseguro: $resource("/atrio-web/api/v1/data/emision/valida-reaseguro", {}, {
                execute: {method: "POST"}
            }),
            vehiculos: $resource("/atrio-web/api/v1/data/cotizacion/vehiculos", {}, {
                execute: {method: "POST"}
            }),
            solicitante: $resource("/atrio-web/api/v1/data/cotizacion/solicitante ", {}, {
                execute: {method: "POST"}
            }),
            tercero: $resource("/atrio-web/api/v1/data/comun/terceros", {}, {
                execute: {method: "POST"}
            }),
            tomador: $resource("/atrio-web/api/v1/data/cotizacion/tomador", {}, {
                execute: {method: "POST"}
            }),
            estado: $resource("/atrio-web/api/v1/data/comun/estados", {}, {
                execute: {method: "POST"}
            }),
            ciudad: $resource("/atrio-web/api/v1/data/comun/ciudades", {}, {
                execute: {method: "POST"}
            }),
            municipio: $resource("/atrio-web/api/v1/data/comun/municipios", {}, {
                execute: {method: "POST"}
            }),
            urbanizacion: $resource("/atrio-web/api/v1/data/comun/urbanizaciones", {}, {
                execute: {method: "POST"}
            }),
            codArea: $resource("/atrio-web/api/v1/data/comun/codareas", {}, {
                execute: {method: "POST"}
            }),
            validaInspeccion: $resource("/atrio-web/api/v1/data/emision/valida-inspeccion2", {}, {
                execute: {method: "POST"}
            }),
            solicitantes: $resource("/atrio-web/api/v1/data/cotizacion/solicitantes", {}, {
                execute: {method: "POST"}
            }),
            tipos:$resource("/atrio-web/api/v1/data/vehiculo/tipos", {}, {
                execute: {method: "POST"}
            }),
            usos:$resource("/atrio-web/api/v1/data/vehiculo/usos", {}, {
                execute: {method: "POST"}
            }),
            actividadesEconomicas: $resource("/atrio-web/api/v1/data/comun/actividades-economicas", {}, {
                execute: {method: "POST"}
            }),
            cotizacionVehiculo: $resource("/atrio-web/api/v1/data/cotizacion/guardar-vehiculo", {}, {
                execute: {method: "POST"}
            }),
            cotizacionSolicitante: $resource("/atrio-web/api/v1/data/cotizacion/guardar-solicitante", {}, {
                execute: {method: "POST"}
            }),
            emisionTomador: $resource("/atrio-web/api/v1/data/emision/guardar-tomador", {}, {
                execute: {method: "POST"}
            }),
            emisionPoliza: $resource("/atrio-web/api/v1/data/emision/polizas", {}, {
                execute: {method: "POST"}
            }),
            cotizacionOficinas: $resource ("/atrio-web/api/v1/data/cotizacion/devuelve-oficinas", {}, {
                execute:{method: "POST"}
            }),
            devuelveCoberturas: $resource ("/atrio-web/api/v1/data/cotizacion/devuelve-coberturas", {}, {
                execute: {method: "POST"}
            }),
            emisionOficina: $resource("/atrio-web/api/v1/data/emision/guardar-oficina", {}, {
                execute: {method: "POST"}
            }),
            cuadroPoliza: $resource ("/atrio-web/api/v1/data/comun/impresion", {}, {
                execute: {method: "POST"}
            }),
            impresionp: $resource ("/atrio-web/api/v1/data/emision/impresion-poliza", {}, {
                execute: {method: "POST"}
            }),
            anexos: $resource ("/atrio-web/api/v1/data/emision/obtener-anexos", {}, {
                execute: {method: "POST"}
            }),
            devuelveFinanciamiento: $resource ("/atrio-web/api/v1/data/emision/financiamiento-resumen", {}, {
                execute: {method: "POST"}
            }),
            devuelvePrima: $resource ("/atrio-web/api/v1/data/cotizacion/primas", {}, {
                execute: {method: "POST"}
            }),
            usuarioActual: $resource("/atrio-web/api/v1/users/current", {}, {
                execute: {method: "POST"}
            }),
            financiamiento: $resource("/atrio-web/api/v1/data/cotizacion/financiamientos", {}, {
                execute: {method: "POST"}
            }),
            financiamientoPlanes: $resource("/atrio-web/api/v1/data/cotizacion/financiamiento-planes", {}, {
                execute: {method: "POST"}
            }),
            financiamientoCalculo: $resource("/atrio-web/api/v1/data/cotizacion/financiamiento-calculo", {}, {
                execute: {method: "POST"}
            }),
            calculoFinanciamiento: $resource("/atrio-web/api/v1/data/cotizacion/calculo-plan", {}, {
                execute: {method: "POST"}
            }),
            guardarFinanciamiento: $resource ("/atrio-web/api/v1/data/cotizacion/guardar-financiamiento", {}, {
                execute: {method: "POST"}
            }),
            emisionBeneficiario: $resource("/atrio-web/api/v1/data/emision/guardar-beneficiario", {}, {
                execute: {method: "POST"}
            }),
            emisionConductor: $resource("/atrio-web/api/v1/data/emision/guardar-conductor", {}, {
                execute: {method: "POST"}
            }),
            devuelveRequisitos: $resource("/atrio-web/api/v1/data/emision/devuelve-requisitos", {}, {
                execute: {method: "POST"}
            }),
            agregaRequisitos: $resource("/atrio-web/api/v1/data/emision/agrega-requisitos", {}, {
                execute: {method: "POST"}
            }),
            eliminaRequisitos: $resource("/atrio-web/api/v1/data/emision/eliminar-requisitos", {}, {
                execute: {method: "POST"}
            }),
            parentescos: $resource("/atrio-web/api/v1/data/comun/devuelve-parentescos", {}, {
                execute: {method:"POST"}
            })
        };
    }]);


    urlServices.factory("UserService", ["$resource", "API_PREFIX",
     function($resource, API_PREFIX){
         return {
             currentUser: $resource("/atrio-web/api/v1/users/comun/terceros", {}, {
                 execute: {method: "POST"}
             }),
             usuarioActual: $resource("/atrio-web/api/v1/users/current", {}, {
                 execute: {method: "POST"}
             }),
             cambiarcontraseña: $resource("/atrio-web/api/v1/data/comun/cambiar-contra", {}, {
                 execute: {method: "POST"}
             }),
             cifrarcontraseña: $resource("/atrio-web/api/v1/data/comun/cifrar-contra", {}, {
                 execute: {method: "POST"}
             })
         };
     }]);

     urlServices.factory("SiniestroService", ["$resource", "API_PREFIX",
     function($resource, API_PREFIX){
         return {
             obtenerPolizas: $resource(API_PREFIX + "/data/siniestro/polizas", {}, {
                 execute: {method: "POST"}
            }),
             obtenerPoliza: $resource(API_PREFIX + "/data/siniestro/detalle-polizas", {}, {
                 execute: {method: "POST"}
             })
        };
    }]);

    urlServices.factory("SiniestroService", ["$resource", "API_PREFIX",
     function($resource, API_PREFIX){
         return {
             obtenerPolizas: $resource("/atrio-web/api/v1/data/siniestro/polizas", {}, {
                 execute: {method: "POST"}
             }),
             obtenerPoliza: $resource("/atrio-web/api/v1/data/siniestro/detalle-polizas", {}, {
                 execute: {method: "POST"}
             }),
             tercero: $resource("/atrio-web/api/v1/data/comun/terceros", {}, {
                 execute: {method: "POST"}
             }),
             estado: $resource("/atrio-web/api/v1/data/comun/estados", {}, {
                 execute: {method: "POST"}
             }),
             ciudad: $resource("/atrio-web/api/v1/data/comun/ciudades", {}, {
                 execute: {method: "POST"}
             }),
             municipio: $resource("/atrio-web/api/v1/data/comun/municipios", {}, {
                 execute: {method: "POST"}
             }),
             urbanizacion: $resource("/atrio-web/api/v1/data/comun/urbanizaciones", {}, {
                 execute: {method: "POST"}
             }),
             parentescos: $resource("/atrio-web/api/v1/data/comun/devuelve-parentescos", {}, {
                 execute: {method:"POST"}
             }),
             codArea: $resource("/atrio-web/api/v1/data/comun/codareas", {}, {
                execute: {method: "POST"}
             }),
             declararSiniestro: $resource("/atrio-web/api/v1/data/siniestro/declarar-siniestro", {}, {
                 execute: {method: "POST"}
             }),
             obtenerSiniestros: $resource("/atrio-web/api/v1/data/siniestro/lista-siniestro", {}, {
                execute: {method: "POST"}
             }),
             obtenerTiposDanos: $resource("/atrio-web/api/v1/data/comun/tipo-danos", {}, {
                execute: {method: "POST"}
             }),
             imprimirDocumento: $resource ("/atrio-web/api/v1/data/comun/impresion", {}, {
                 execute: {method: "POST"}
            }),

         };
     }]);


    urlServices.factory("ComunService", ["$resource", "API_PREFIX",
     function($resource, API_PREFIX){
         return {
            usuarioActual: $resource("/atrio-web/api/v1/users/current", {}, {
                execute: {method: "POST"}
            })
         };
     }]);

});
