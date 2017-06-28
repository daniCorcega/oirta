define(['angular'], function(angular){
    'use strict';
    var urlServices = angular.module('urlServices', ['ngResource']);

    urlServices.factory('CotizadorVehiculoService', ['$resource', 'API_PREFIX',
    function($resource, API_PREFIX){
        return {
            tercero: $resource('/atrio-web/api/v1/data/comun/terceros', {}, {
                execute: {method: 'POST'}
            }),
            anio: $resource('/atrio-web/api/v1/data/vehiculo/anios', {}, {
                execute: {method: 'POST'}
            }),
            marca:$resource('/atrio-web/api/v1/data/vehiculo/marcas', {}, {
                execute: {method: 'POST'}
            }),
            modelo: $resource('/atrio-web/api/v1/data/vehiculo/modelos', {}, {
                execute: {method: 'POST'}
            }),
            version: $resource('/atrio-web/api/v1/data/vehiculo/versiones', {}, {
                execute: {method: 'POST'}
            }),
            estado: $resource('/atrio-web/api/v1/data/comun/estados', {}, {
                execute: {method: 'POST'}
            }),
            codArea: $resource('/atrio-web/api/v1/data/comun/codareas', {}, {
                execute: {method: 'POST'}
            }),
            cotizacionSolicitante: $resource('/atrio-web/api/v1/data/cotizacion/guardar-solicitante', {}, {
                execute: {method: 'POST'}
            }),
            cotizacionVehiculo: $resource('/atrio-web/api/v1/data/cotizacion/guardar-vehiculo', {}, {
                execute: {method: 'POST'}
            }),
            planes: $resource('/atrio-web/api/v1/data/cotizacion/planes', {}, {
                execute: {method: 'POST'}
            }),
            cobertura: $resource('/atrio-web/api/v1/data/cotizacion/coberturas', {}, {
                execute: {method: 'POST'}
            }),
            coberturasAdicionales: $resource('/atrio-web/api/v1/data/cotizacion/coberturas-adicionales', {}, {
                execute: {method: 'POST'}
            }),
            tarificarCoberturasAdicionales: $resource('/atrio-web/api/v1/data/cotizacion/tarificar-coberturas-adicionales', {}, {
                execute: {method: 'POST'}
            }),
            descuento: $resource('/atrio-web/api/v1/data/cotizacion/descuentos', {}, {
                execute: {method: 'POST'}
            }),
           guardarDescuento: $resource('/atrio-web/api/v1/data/cotizacion/guardar-descuento', {}, {
                execute: {method: 'POST'}
            }),

            financiamiento: $resource('/atrio-web/api/v1/data/cotizacion/financiamientos', {}, {
                execute: {method: 'POST'}
            }),
            pago: $resource('/atrio-web/api/v1/data/cotizacion/pagos', {}, {
                execute: {method: 'POST'}
            }),
            porcentajes: $resource('/atrio-web/api/v1/data/cotizacion/porcentajes', {}, {
                execute: {method: 'POST'}
            }),
            guardarFinanciamiento: $resource ('/atrio-web/api/v1/data/cotizacion/guardar-financiamiento', {}, {
                execute: {method: 'POST'}
            }),
            cotizacionCobertura: $resource ('/atrio-web/api/v1/data/cotizacion/guardar-coberturas2', {}, {
                execute: {method: 'POST'}
            }),
            cotizacionesCompletas: $resource('/atrio-web/api/v1/data/cotizacion/lista-completa', {}, {
                execute: {method: 'POST'}
            }),
        };
    }]);

    urlServices.factory('EmisionVehiculoService', ['$resource', 'API_PREFIX',
    function($resource, API_PREFIX){
        return {
            cotizaciones: $resource('/atrio-web/api/v1/data/cotizacion/lista', {}, {
                execute: {method: 'POST'}
            }),
            vehiculos: $resource('/atrio-web/api/v1/data/cotizacion/vehiculos', {}, {
                execute: {method: 'POST'}
            }),
            solicitante: $resource('/atrio-web/api/v1/data/cotizacion/solicitante ', {}, {
                execute: {method: 'POST'}
            }),
            tercero: $resource('/atrio-web/api/v1/data/comun/terceros', {}, {
                execute: {method: 'POST'}
            }),
            tomador: $resource('/atrio-web/api/v1/data/cotizacion/tomador', {}, {
                execute: {method: 'POST'}
            }),
            estado: $resource('/atrio-web/api/v1/data/comun/estados', {}, {
                execute: {method: 'POST'}
            }),
            ciudad: $resource('/atrio-web/api/v1/data/comun/ciudades', {}, {
                execute: {method: 'POST'}
            }),
            municipio: $resource('/atrio-web/api/v1/data/comun/municipios', {}, {
                execute: {method: 'POST'}
            }),
            urbanizacion: $resource('/atrio-web/api/v1/data/comun/urbanizaciones', {}, {
                execute: {method: 'POST'}
            }),
            codArea: $resource('/atrio-web/api/v1/data/comun/codareas', {}, {
                execute: {method: 'POST'}
            }),
            validaInspeccion: $resource('/atrio-web/api/v1/data/emision/valida-inspeccion', {}, {
                execute: {method: 'POST'}
            }),
            solicitantes: $resource('/atrio-web/api/v1/data/cotizacion/solicitantes', {}, {
                execute: {method: 'POST'}
            }),
            tipos:$resource('/atrio-web/api/v1/data/vehiculo/tipos', {}, {
                execute: {method: 'POST'}
            }),
            usos:$resource('/atrio-web/api/v1/data/vehiculo/usos', {}, {
                execute: {method: 'POST'}
            }),
            actividadesEconomicas: $resource('/atrio-web/api/v1/data/comun/actividades-economicas', {}, {
                execute: {method: 'POST'}
            }),
            cotizacionVehiculo: $resource('/atrio-web/api/v1/data/cotizacion/guardar-vehiculo', {}, {
                execute: {method: 'POST'}
            }),
            cotizacionSolicitante: $resource('/atrio-web/api/v1/data/cotizacion/guardar-solicitante', {}, {
                execute: {method: 'POST'}
            }),
            emisionTomador: $resource('/atrio-web/api/v1/data/emision/guardar-tomador', {}, {
                execute: {method: 'POST'}
            }),
            emisionPoliza: $resource('/atrio-web/api/v1/data/emision/polizas', {}, {
                execute: {method: 'POST'}
            }),
            devuelveCoberturas: $resource ('/atrio-web/api/v1/data/cotizacion/devuelve-coberturas', {}, {
                execute: {method: 'POST'}
            }),
            cuadroPoliza: $resource ('/atrio-web/api/v1/data/comun/impresion', {}, {
                execute: {method: 'POST'}
            }),
            devuelvePrima: $resource ('/atrio-web/api/v1/data/cotizacion/primas', {}, {
                execute: {method: 'POST'}
            })
        };
    }]);

        
    urlServices.factory('UserService', ['$resource', 'API_PREFIX',
     function($resource, API_PREFIX){
         return {
             currentUser: $resource('/atrio-web/api/v1/users/comun/terceros', {}, {
                 execute: {method: 'POST'}
             })
         };
     }]);

     urlServices.factory('SiniestroService', ['$resource', 'API_PREFIX',
     function($resource, API_PREFIX){
         return {
             obtenerPolizas: $resource(API_PREFIX + '/data/siniestro/polizas', {}, {
                 execute: {method: 'POST'}
             }),
             obtenerPoliza: $resource(API_PREFIX + '/data/siniestro/detalle-polizas', {}, {
                 execute: {method: 'POST'}
             }),
         }
     }])
});
