    define(['angular'], function (angular) {
    'use strict';
    var proveedorControllers = angular.module('proveedorControllers', ['ngTable']);

    proveedorControllers.controller('ConsultaProveedorCtr', ['$state', '$scope','ProveedorService','ngTableParams', '$filter','mensaje','$window',
        function ($state, $scope, ProveedorService, ngTableParams, $filter, mensaje, $window) {            	    
        $scope.estatuses = [
        { 'val': '',
          'descrip' : 'Todos los Estatus' },
        { 'val': 'PAG',
          'descrip' : 'Pagado' },
        { 'val': 'OPT',
          'descrip' : 'Aprobación Pago' },
        { 'val': 'ANU',
          'descrip' : 'Anulada' }
        ];

	    $scope.datosFiltro = {
		'factura' : "",
        'fecha_factura': "",
		'estatus' : $scope.estatuses[1]
	    };
	    
      
        $scope.cargado = 1;
            ProveedorService.consulta.execute({
               "i_CodUsr": "'i_CodUsr'"
            }, function (data) {

       	$scope.cargado = 2;
            $scope.proveedor = data.facturas_cur; 
             jQuery.map($scope.proveedor,function (proveedores, i) {
                    $scope.proveedor[i].numfact = (proveedores.factura);
                    $scope.proveedor[i].numcompr = (proveedores.compriva);
                    $scope.proveedor[i].mtoimponible = (proveedores.base_imponible);
                    $scope.proveedor[i].mtoiva = (proveedores.iva);
                    $scope.proveedor[i].numctrolfact = (proveedores.numcontrol);
                    $scope.proveedor[i].fecfact = (proveedores.fecha_factura);
                    $scope.proveedor[i].mtofact = (proveedores.monto_factura);
                    $scope.proveedor[i].stsoblig = (proveedores.estatus_factura);
                    $scope.proveedor[i].numoblig = (proveedores.numoblig);
                    $scope.proveedor[i].comprislr = (proveedores.comprislr);
                    $scope.proveedor[i].compriva = (proveedores.compriva);
                    //var nombre = $scope.cotizaciones[i].nombre == undefined ? "" : ($scope.cotizaciones[i].nombre.split(" "))[0];
                    //var apellido = $scope.cotizaciones[i].apellido == undefined ? "" : ($scope.cotizaciones[i].apellido.split(" "))[0];                   
                    //$scope.cotizaciones[i].solicitante = nombre + " " + apellido;
                  }); 

		$scope.cargado = 3;	
            $scope.tableParams = new ngTableParams({
            page: 1,            
            count: 10,
            sorting: {
                factura:'desc'
                },
            filter: {
                estatus_factura: 'PAG'
                }
            }, {
                total: $scope.proveedor.length, // length of data
                getData: function($defer, params) {
                    var filteredData = params.filter() ?
                            $filter('filter')($scope.proveedor, params.filter()) : $scope.proveedor; 

                    var orderedData = params.sorting() ? 
                            $filter('orderBy')(filteredData, params.orderBy()) : filteredData;

                    params.total(orderedData.length);
                            $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                }
            });
		    }, function (response) {
                mensaje.errorRed('Cargando Facturas',response.status);
            });

            $scope.mostrarProveedor = function () {
                var mostrar = $scope.usuario ? $.inArray("PROVEEDOR",$scope.usuario.roles) : -1;
                return mostrar;
            };

            //$scope.mostrarEmisor = function () {
              //  var mostrar = $scope.usuario ? $.inArray("EMISOR",$scope.usuario.roles) : -1;
                //return mostrar;
            //};
            //$scope.emitir = function (nrosolic) {
              //  $scope.poliza = emitirCotizacion;
                //$scope.poliza.nro = nrosolic;
                //$scope.poliza.ambiente = 2;
                //$state.go('emisionvehiculo');
            //};

            //$scope.enviarCotizacion = function (nrosolic) {
              //  for (var i = 0; i < $scope.cotizaciones.length; i++) {
                //    if ($scope.cotizaciones[i].nrosolic == nrosolic) {
                  //      mensaje.enviarCotizacion($scope.cotizaciones[i].nrosolic,$scope.cotizaciones[i].solicitante);
                    //    break;
                    //};
                //};                  
            //};

	    $scope.filtrar = function () {
		$scope.tableParams.filter({'factura':$scope.datosFiltro.factura, 'estatus_factura': $scope.datosFiltro.estatus.val});
	    };
         $scope.filtrar2 = function () {
        $scope.tableParams.filter({'fecha_factura':$scope.datosFiltro.fecha_factura, 'estatus_factura': $scope.datosFiltro.estatus.val});
        };

	    $scope.filtrarEstatus = function (estatus) {
		$scope.datosFiltro.estatus = estatus;
		$scope.filtrar();
        $scope.filtrar2();
	    };
         
        $scope.descargarRetencion = function (nnumoblig,ctipoobjeto){
                ProveedorService.retencion.execute({
                "ctipoobjeto":ctipoobjeto,
                "nnumoblig":nnumoblig
        }, function(data) {
            $window.open(data.result,'_blank');
        });
        };                                               
            
 }]);                     
});
    
        



         