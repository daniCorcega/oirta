define(['angular'], function (angular) {
    'use strict';
    var siniestroControllers = angular.module('siniestroControllers', ['ngTable']);

    siniestroControllers.controller('SiniestroListaCtr', ['$scope', 'SiniestroService', 'ngTableParams', '$filter', '$timeout', 'mensaje',
        function ($scope, SiniestroService, ngTableParams, $filter,  $timeout, mensaje) {          
             $scope.tiposId = ['Venezolano', 'Extranjero', 'Pasaporte', 'Jurídico', 'Gubernamental'];
             $scope.tipoBusqueda = 'cedula';
             $scope.datosBusqueda = {tipoId: $scope.tiposId[0]};
             $scope.form = $('#w1 form');
             $scope.mostrar = false;
             
             $scope.w1validator = $("#w1 form").validate({
                 highlight: function (element) {
                     $('.has-error .form-control:disabled').closest('.form-group').removeClass('has-error');
                     $('.form-control:disabled').siblings('.error:visible').remove();
                     $(element).closest('.form-group').removeClass('has-success').addClass('has-error');
                 },
                 success: function (element) {
                     $(element).closest('.form-group').removeClass('has-error');
                     $(element).remove();
                },
                 errorPlacement: function (error, element) {
                    element.parent().append(error);
                 },
                 rules: {
                    // Vehiculo
                     tipoId: {
                         required: true
                     },
                    cedula:{
                        required: true
                    },
                    placa:{
                        required: true
                    },
                    poliza:{
                        required: true
                    },
                 }
             });             

             $scope.verificarData = function() {
                 if ($scope.mostrar && $scope.siniestros) {
                     $scope.mostrar = false;
                 };
             };
             
             $scope.limpiarDatos = function(){
		 $scope.datosBusqueda.tipoId = undefined;
                 $scope.datosBusqueda.cedula = undefined;
                 $scope.datosBusqueda.poliza = undefined;
                 $scope.datosBusqueda.placa = undefined;
		 
		 $timeout(function () {
		     if ($scope.tipoBusqueda == 'cedula') {
			 $scope.datosBusqueda.tipoId = $scope.tiposId[0];
		     };
		 }, 100);		
             };
             
             $scope.listaSiniestros = function() {
                 return $scope.siniestros;
             };

            $scope.datosFiltro = { //Filtros agregados 11/08/16
                'numsiniestro' : ""
            };

            $scope.filtrar = function () {
            $scope.tableParams.filter({'numsiniestro':$scope.datosFiltro.numsiniestro});
        };

             $scope.obtenerSiniestros = function () {
		 $scope.siniestros = [];
                 if ($scope.form.valid()) {
                     var datos = $scope.datosBusqueda;
                     SiniestroService.obtenerSiniestros.execute({
                         'i_tipo_id': datos.cedula ? datos.tipoId.substring(0,1) : null,
                         'i_num_id': datos.cedula ? datos.cedula : null,
                         'i_num_poliza': datos.poliza ? datos.poliza : null,
                         'i_placa': datos.placa ? datos.placa : null,
                         'i_cod_usuario' : 'BMRIVAS'
                     }, function (data) {
		         $scope.mostrar = false;
			 if (data.siniestros_cur.length > 0) {
                             $scope.mostrar = true;
                             $scope.siniestros = data.siniestros_cur;

                             if ($scope.tableParams) {
                                 $scope.tableParams.reload();
                             } else {
                                 $scope.tableParams = new ngTableParams({
				     page:1,
				     count:10,
				     sorting:{
                                          
				     }
                                 }, {
				     total: $scope.listaSiniestros().length, // length of data
				     getData: function($defer, params) {
                                         var filteredData = params.filter() ?
                                             $filter('filter')($scope.listaSiniestros(), params.filter()) : $scope.listaSiniestros();
                                         
                                         var orderedData = params.sorting() ?
                                             $filter('orderBy')(filteredData, params.orderBy()) : filteredData;
                                         
                                         params.total(orderedData.length);
                                         $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));                                 
				     },
                                     $scope: {$data:{}}
                                 });
                                 $scope.tableParams.settings().$scope = $scope;
                             };
			 } else {
                             mensaje.info("No existen siniestros asociados a estos datos");
                             $scope.siniestros = undefined;
			 };
                     }, function (response) {
                         mensaje.info("No existen siniestros asociados a estos datos");
                         $scope.siniestros = undefined;
                     });
                 };
             };

         }]);

    siniestroControllers.controller('SiniestroWizardCtr', ['$scope','$state', 'mensaje', '$modal','SiniestroService',
        function($scope, $state, mensaje, $modal, SiniestroService){
            $scope.tiposId = ['Venezolano', 'Extranjero', 'Pasaporte', 'Jurídico', 'Gubernamental'];
            $scope.edosCivil = ['Soltero','Casado','Divorciado','Viudo'];
            $scope.sexos = ['Femenino', 'Masculino'];
            
            $scope.ambienteVehiculo = {
                datosBusqueda: {
                    tipoId: $scope.tiposId[0]
                }
            };
            $scope.ambienteVehiculo.tipoBusqueda = 'cedula';
            $scope.ambienteVehiculo.vehiculo = Object();
            $scope.poliza = Object();
            $scope.ambienteTitular = Object();
            $scope.ambienteTitular.titular = Object();
            $scope.ambienteConductor = Object();
            $scope.ambienteConductor.conductor = Object();
            $scope.ambienteConductor.siniestro = Object();
            $scope.ambienteConductor.conductor.esTitular = 'S';
            $scope.ambienteDanos = Object();
            $scope.ambienteResumen = Object();
            $scope.ambienteResumen.buenaFe = 'N';
            $scope.ambienteResultado = Object();

            
            SiniestroService.parentescos.execute(null,
            function(data) {
                $scope.ambienteConductor.parentescos = data.parentescos_cur;
            }, function(response) {
                mensaje.errorRed('Parentescos', response.status,true);
            });
            SiniestroService.estado.execute(null,
            function (data) {
                $scope.estados = data.estado_cur;
	    }, function (response) {
	        mensaje.errorRed('Estados',response.status,true);
	    });
            SiniestroService.ciudad.execute(null,
            function (data) {
                $scope.ciudades = data.ciudad_cur;
	    }, function (response) {
	        mensaje.errorRed('Ciudades',response.status,true);
	    });
            SiniestroService.municipio.execute(null,
            function (data) {
                $scope.municipios = data.municipio_cur;
	    }, function (response) {
	        mensaje.errorRed('Municipios',response.status,true);
	    });
            SiniestroService.urbanizacion.execute(
            { 'ccodpais': 'VNZ'},
            function (data) {
                $scope.urbanizaciones = data.urbanizacion_cur;
	    }, function (response) {
	        mensaje.errorRed('Urbanizaciones',response.status,true);
            });
            SiniestroService.codArea.execute(null,
            function (data) {
                $scope.codAreas = data.codtele_cur;
	    }, function (response) {
	        mensaje.errorRed('Codigos de Area',response.status,true);
	    });
            SiniestroService.obtenerTiposDanos.execute(null,
            function (data) {
                $scope.ambienteConductor.tiposDanos = data.tipodano_cur;
	    }, function (response) {
	        mensaje.errorRed('Tipos de Da�os',response.status,true);
	    });
            var $w1finish = $('#w1').find('ul.pager li.finish');
            $scope.form = $('#w1 form');

            $scope.w1validator = $("#w1 form").validate({
                highlight: function (element) {
                    $('.has-error .form-control:disabled').closest('.form-group').removeClass('has-error');
                    $('.form-control:disabled').siblings('.error:visible').remove();
                    $(element).closest('.form-group').removeClass('has-success').addClass('has-error');
                },
                success: function (element) {
                    $(element).closest('.form-group').removeClass('has-error');
                    $(element).remove();
                },
                errorPlacement: function (error, element) {
                    element.parent().append(error);
                },
                rules: {
                    // Vehiculo
                    cedula:{
                        required: true
                    },
                    placa:{
                        required: true
                    },
                    poliza:{
                        required: true
                    },
                    tipoBusqueda:{
                        required: true
                    },
                    email:{
                        required: true,
                        email: true
                    },
                    titularEmail :{
                        required: true,
                        email: true
                    },
                    siniestroHora:{
                        required: true
                    },
                    autoridadesEscena:{
                        required: true
                    },
                    vehiculoDetenido:{
                        required: true
                    },
                    vehiculoRueda:{
                        required: true
                    },
                    vehiculoEstacionado:{
                        required: true
                    },
                    roboAccesorios:{
                        required: true
                    },
                    roboVehiculo:{
                        required: true
                    },
                    danosTerceros:{
                        required: true
                    },
                    conductorLicencia :{
                        required: true
                    },
                    danosCorporales : {
                        required: true
                    },
                    siniestroDanos: {
                        required: function(element) {
                            var result = true;
                            for (var i = 0; i < $scope.ambienteDanos.piezas.length; i++) {
                                if ($scope.ambienteDanos.piezas[i].sel){
                                    result = false;
                                    break;
                                }
                            };
                            return result;
                        }
                    },
                    codArea2 :{
                        required: function(element) {
                            var result = false;
                            if ($scope.ambienteTitular.titular.telefono2) {
                                if ($scope.ambienteTitular.titular.telefono2.length > 0) {
                                    result = true;
                                }
                            };
                            return result;
                        }
                    },
                    telefono2: {
                        required: function(element) {
                            var result = false;
                            if ($scope.ambienteTitular.titular.codArea2 != undefined) {
                                result = true;
                            }
                            return result;
                        }
                    },
                    
                }
            });

            $w1finish.on('click', function (ev) {
                ev.preventDefault();
                var procesado = $scope.ambienteResultado.numsin == undefined ? false : true;
                var buenaFe = $scope.ambienteResumen.buenaFe == 'S' ? true : false;
                if (!procesado) {
                    if (!buenaFe) {
                        mensaje.error("Usted debe confirmar la declaración de buena fe para poder continuar");
                    } else {
                        var $modalInstance = $modal.open({
                            templateUrl: 'views/siniestro/confirmar_siniestro.html',
                            controller: 'SiniestroConfirmarCtr',
                            scope: $scope
                        });         
                        $modalInstance.result.then(function (result) {
                            if (result)  {
                                SiniestroService.declararSiniestro.execute({
                                    'cdetdecla': $scope.ambienteDanos.piezasLeibles ? $scope.ambienteDanos.piezasLeibles +'. '+ $scope.ambienteDanos.danos : $scope.ambienteDanos.danos,
                                    'nidepol': parseInt($scope.ambienteVehiculo.polizaSeleccionada.idepol),
                                    'nnumcert': parseInt($scope.ambienteVehiculo.polizaSeleccionada.numcert),
                                    'cfecocurr': $scope.ambienteVehiculo.datosBusqueda.fechaSiniestro,
                                    'cdetsini': $scope.ambienteDanos.sucedido,
                                    'ctelef1': $scope.ambienteTitular.titular.codArea1.codtelefono + $scope.ambienteTitular.titular.telefono1.substring(0,3) + $scope.ambienteTitular.titular.telefono1.substring(4,8),
                                    'ctelef2': $scope.ambienteTitular.titular.codArea2 != undefined && $scope.ambienteTitular.titular.telefono2 != undefined ? $scope.ambienteTitular.titular.codArea2.codtelefono + $scope.ambienteTitular.titular.telefono2.substring(0,3) + $scope.ambienteTitular.titular.telefono2.substring(4,8) : null,
                                    'cindtransito': $scope.ambienteConductor.siniestro.autoridadesEscena,
                                    'cinddanoterc': $scope.ambienteConductor.siniestro.danosTerceros,
                                    'cindconductortit': $scope.ambienteConductor.conductor.esTitular,
                                    'ctipoidconductor': $scope.ambienteConductor.conductor.tipoId.substring(0,1),
                                    'nnumidconductor': $scope.ambienteConductor.conductor.numId,
                                    'cnombreconductor': $scope.ambienteConductor.conductor.nombre,
                                    'capellidoconductor': $scope.ambienteConductor.conductor.apellidos,
                                    'crelacionaseg': $scope.ambienteConductor.conductor.parentesco.codlval,
                                    'clugarocurr': $scope.ambienteConductor.siniestro.direccion,
                                    'choraocurr': $scope.ambienteVehiculo.datosBusqueda.horaSiniestro.split(" ")[0].split(":")[0],
                                    'cminutoocurr': $scope.ambienteVehiculo.datosBusqueda.horaSiniestro.split(" ")[0].split(":")[1],
                                    'chorarioocurr': $scope.ambienteVehiculo.datosBusqueda.horaSiniestro.split(" ")[1],
                                    'cdanotercero': $scope.ambienteDanos.danosTerceros ? $scope.ambienteDanos.danosTerceros : null,
                                    'cemail': $scope.ambienteTitular.titular.email,
                                    'ccoduser': 'BMRIVAS',
                                    'cindrueda': $scope.ambienteConductor.siniestro.vehiculoRueda,
                                    'cindestacionado': $scope.ambienteConductor.siniestro.vehiculoEstacionado,
                                    'cinddetenido': $scope.ambienteConductor.siniestro.vehiculoDetenido,
                                    'cfecnacconductor': $scope.ambienteConductor.conductor.fechaNacimiento,
                                    'cedocivilconductor': $scope.ambienteConductor.conductor.edocivil.substring(0,1),
                                    'csexoconductor': $scope.ambienteConductor.conductor.sexo.substring(0,1),
                                    'ccodestado': $scope.ambienteConductor.siniestro.estado.codestado,
                                    'ccodciudad': $scope.ambienteConductor.siniestro.ciudad.codciudad,
                                    'ccodmunicipio': $scope.ambienteConductor.siniestro.municipio.codmunicipio,
                                    'ccodurbanizacion': $scope.ambienteConductor.siniestro.urbanizacion.codurbanizacion,
                                    'indroboaccesorios': $scope.ambienteConductor.siniestro.roboAccesorios,
                                    'cindtienelicencia': $scope.ambienteConductor.conductor.licencia,
                                    'ctipodano': $scope.ambienteConductor.siniestro.tipoDano.codigo,
                                    'nvelocidadveh': $scope.ambienteConductor.siniestro.velocidad
                                }, function (data) {
                                    $scope.ambienteResultado.numsin = parseInt(data.nnumsin);
                                    $scope.ambienteResultado.idesin = parseInt(data.nidesin);

                                    SiniestroService.imprimirDocumento.execute({
                                        'nidobjeto':$scope.ambienteResultado.idesin,
                                        'ctipoobjeto':'SIN'
                                    }, function(data) {
                                        $scope.ambienteResultado.url = data.url;
					if (data.url == 'NO') {
					    mensaje.info("Debe comunicarse con el \xE1rea t\xE9cnica para realizar la impresi\xF3n de su declaracion de siniestro");
					};
                                    });
                                        
                                    /* 
                                      EmisionVehiculoService.cuadroPoliza.execute({
                                      'nidobjeto':$scope.ambienteResultado.idepol,
                                      'nnumcertificado':$scope.ambienteResultado.numcert,
                                      "ctipoobjeto":"POL"
                                      }, function(data) {
                                      $scope.ambienteResultado.url = data.url;
                                      }, function(response) {
                                      mensaje.errorRed('Generando Poliza',response.status);
                                      });
                                      */
                                 },function (response) {
                                     mensaje.errorRed('Declarando el Siniestro',response.status);
                                 });
  
                                $state.go('siniestro.resultado');
                            };
                        });
                    };
                } else {
                    if ($scope.pasoActivo == 4) {
                        $state.go('siniestro.resultado');                      
                    } else {
                        var modalInstance = $modal.open({
                            templateUrl: 'views/siniestro/finalizar_siniestro.html',
                            controller: 'SiniestroFinalizarCtr',
                            scope: $scope
                        });                        
                    };
                };
            });

            $('#w1').bootstrapWizard({
                tabClass: 'wizard-steps',
                nextSelector: 'ul.pager li.next',
                previousSelector: 'ul.pager li.previous',
                firstSelector: null,
                lastSelector: null,
                onPrevious: function (tab, navigation, index) {
                    var states = {
                        0 : "siniestro.vehiculo",
                        1 : "siniestro.titular",
                        2 : "siniestro.conductor",
                        3 : "siniestro.danos",
                        4 : "siniestro.resumen"
                    };
                    $state.go(states[index]);
                },
                onNext: function (tab, navigation, index, newindex) {
                    var validated = $('#w1 form').valid();
                    if (!validated) {
                        $scope.w1validator.focusInvalid();
                        return false;
                    }
                    switch (index) {
                        case 1:
                            if(!$scope.ambienteVehiculo.polizaSeleccionada){
                                mensaje.error('Por favor seleccione una póliza de la lista');
                                return false;
                            }else{
                                if ($scope.ambienteVehiculo.polizaSeleccionada.anoveh == undefined) {
                                    SiniestroService.obtenerPoliza.execute({
                                        'ccodusuario': 'BMRIVAS',
                                        'nidepol': parseInt($scope.ambienteVehiculo.polizaSeleccionada.idepol),
                                        'nnumcert': parseInt($scope.ambienteVehiculo.polizaSeleccionada.numcert)
                                    },function(data){
                                        $scope.ambienteVehiculo.detallePoliza = data.poliza_detalle_cur[0];
                                        
                                        // Poliza 
                                        $scope.ambienteVehiculo.polizaSeleccionada.numpol = data.poliza_detalle_cur[0].numpol;
                                        $scope.ambienteVehiculo.polizaSeleccionada.numcert = data.poliza_detalle_cur[0].numcert;
                                                                                
                                        // Titular
                                        $scope.ambienteTitular.titular.telefonos = [];
                                        $scope.ambienteTitular.titular.apellidos = data.poliza_detalle_cur[0].apeter;
                                        $scope.ambienteTitular.titular.nombre = data.poliza_detalle_cur[0].nomter;
                                        $scope.ambienteTitular.titular.numId = data.poliza_detalle_cur[0].numid;
                                        $scope.ambienteTitular.titular.tipoId = tipoIdPorInicial(data.poliza_detalle_cur[0].tipoid);
                                        $scope.ambienteTitular.titular.edocivil = edoCivilPorInicial(data.poliza_detalle_cur[0].edocivil);
                                        $scope.ambienteTitular.titular.estado = data.poliza_detalle_cur[0].codestado != null ? estadoPorID(data.poliza_detalle_cur[0].codestado) : null;
                                        
                                        $scope.ambienteTitular.titular.ciudad = $scope.ambienteTitular.titular.estado != null && data.poliza_detalle_cur[0].codciudad != null ? ciudadPorID($scope.ambienteTitular.titular.estado.codestado,data.poliza_detalle_cur[0].codciudad) : null;
                                        $scope.ambienteTitular.titular.municipio = $scope.ambienteTitular.titular.ciudad != null && data.poliza_detalle_cur[0].codmunicipio != null ? municipioPorID($scope.ambienteTitular.titular.estado.codestado,$scope.ambienteTitular.titular.ciudad.codciudad,data.poliza_detalle_cur[0].codmunicipio) : null;
                                        $scope.ambienteTitular.titular.urbanizacion = $scope.ambienteTitular.titular.municipio != null && data.poliza_detalle_cur[0].codurbanizacion != null ? urbanizacionPorID($scope.ambienteTitular.titular.estado.codestado,$scope.ambienteTitular.titular.ciudad.codciudad,$scope.ambienteTitular.titular.municipio.codmunicipio,data.poliza_detalle_cur[0].codurbanizacion) : null;
                                        $scope.ambienteTitular.titular.direccion = data.poliza_detalle_cur[0].direc;
                                        
                                        
                                        $scope.ambienteTitular.titular.sexo = sexoPorInicial(data.poliza_detalle_cur[0].sexo);
                                        $scope.ambienteTitular.titular.fechaNacimiento = data.poliza_detalle_cur[0].fecha;
                                        $scope.ambienteTitular.titular.telefonos[0] = data.poliza_detalle_cur[0].telef1;
                                        $scope.ambienteTitular.titular.telefonos[1] = data.poliza_detalle_cur[0].telef2;
                                        $scope.ambienteTitular.titular.email = data.poliza_detalle_cur[0].email;
                                        iniciarTelefonos();
                                        
                                        // Vehiculo
                                        $scope.ambienteVehiculo.vehiculo.anoveh = parseInt(data.poliza_detalle_cur[0].anoveh);
                                        $scope.ambienteVehiculo.vehiculo.marca = data.poliza_detalle_cur[0].marca;
                                        $scope.ambienteVehiculo.vehiculo.modelo = data.poliza_detalle_cur[0].modelo;
                                        $scope.ambienteVehiculo.vehiculo.version = data.poliza_detalle_cur[0].version;
                                        $scope.ambienteVehiculo.vehiculo.carroceria = data.poliza_detalle_cur[0].serialcarroceria;
                                        $scope.ambienteVehiculo.vehiculo.motor = data.poliza_detalle_cur[0].serialmotor;
                                        
                                        // Siniestro
                                        $scope.ambienteConductor.siniestro.estado = $scope.ambienteTitular.titular.estado ? $scope.ambienteTitular.titular.estado : null;
                                        $scope.ambienteConductor.siniestro.ciudad = $scope.ambienteTitular.titular.ciudad ? $scope.ambienteTitular.titular.ciudad : null;
                                        $scope.ambienteConductor.siniestro.municipio = $scope.ambienteTitular.titular.municipio ? $scope.ambienteTitular.titular.municipio : null;
                                    
                                        $state.go('siniestro.titular');
                                    },function(){
                                        mensaje.error('Error obteniendo detalle de Póliza', true);
                                        return false;
                                    }); 
                                } else {
                                    $state.go('siniestro.titular');
                                };
                            };

                            break;
                        case 2:
                            $state.go('siniestro.conductor');
                            break;
                        case 3:
                            $state.go('siniestro.danos');
                            break;
                        case 4:
                            $state.go('siniestro.resumen');
                            break;
                        default:
                            break;
                    };
                },
                onTabClick: function (tab, navigation, index, newindex) {
                    var states = {
                        0 : "siniestro.vehiculo",
                        1 : "siniestro.titular",
                        2 : "siniestro.conductor",
                        3 : "siniestro.danos",
                        4 : "siniestro.resumen"
                    };
                    if (newindex == index + 1) {
                        return this.onNext(tab, navigation, index+1, newindex);
                    } else if (newindex > index + 1) {
                        return false;
                    } else {
                        $state.go(states[newindex]);
                    };
                },
                onTabChange: function (tab, navigation, index, newindex) {
                    var totalTabs = navigation.find('li').size() - 1;
                    $w1finish[newindex != totalTabs ? 'addClass' : 'removeClass']('hidden');
                    $('#w1').find(this.nextSelector)[newindex == totalTabs ? 'addClass' : 'removeClass']('hidden');
                }
            });

            function sexoPorInicial(inicial) {
                for (var i = 0; i < $scope.sexos.length; i++) {
                    if ($scope.sexos[i].substring(0,1) == inicial) {
                        return $scope.sexos[i];
                    }
                };
            };

            function edoCivilPorInicial(inicial) {
                for (var edoCivil = 0; edoCivil < $scope.edosCivil.length; edoCivil++) {
                    if ($scope.edosCivil[edoCivil].substring(0,1) == inicial) {
                        return $scope.edosCivil[edoCivil];
                    }
                }
            };       
            
            function tipoIdPorInicial(inicial) {
                for (var i = 0; i < $scope.tiposId.length; i++) {
                    if ($scope.tiposId[i].substring(0,1) == inicial) {
                        return $scope.tiposId[i];
                    }
                };
            };
            
            function estadoPorID(id) {
                for (var estado = 0; estado < $scope.estados.length; estado++) {
                    if ($scope.estados[estado].codestado == id) {
                        return $scope.estados[estado];
                    }
                }
            };
            
            function ciudadPorID(idestado, idciudad) {
                for (var ciudad = 0; ciudad < $scope.ciudades.length; ciudad++) {
                    if (($scope.ciudades[ciudad].codestado == idestado) && ($scope.ciudades[ciudad].codciudad == idciudad)) {
                        return $scope.ciudades[ciudad];
                    }
                }
            };
            
            function municipioPorID(idestado, idciudad, idmunicipio) {
                for (var municipio = 0; municipio < $scope.municipios.length; municipio++) {
                    if (($scope.municipios[municipio].codestado == idestado) && ($scope.municipios[municipio].codciudad == idciudad) && ($scope.municipios[municipio].codmunicipio == idmunicipio)) {
                        return $scope.municipios[municipio];
                    }
                }
            };
            
            function urbanizacionPorID(idestado, idciudad, idmunicipio, idurbanizacion) {
                for (var urbanizacion = 0; urbanizacion < $scope.urbanizaciones.length; urbanizacion++) {
                    if (($scope.urbanizaciones[urbanizacion].codestado == idestado) && ($scope.urbanizaciones[urbanizacion].codciudad == idciudad) && ($scope.urbanizaciones[urbanizacion].codmunicipio == idmunicipio) && ($scope.urbanizaciones[urbanizacion].codurbanizacion == idurbanizacion)) {
                        return $scope.urbanizaciones[urbanizacion];
                    }
                }
            };
            
            function codAreasPorCod(code) {
                for (var codigo = 0; codigo < $scope.codAreas.length; codigo++) {
                    if ($scope.codAreas[codigo].codtelefono == code) {
                        return $scope.codAreas[codigo];
                    }	
                }
            };

            var finalizar = function() {
                var modalInstance = $modal.open({
                    templateUrl: 'views/siniestro/vehiculo/finalizar_siniestro.html',
                    controller: 'SiniestroFinalizar',
                    scope: $scope
                });
            };

            function iniciarTelefonos () {
                var telefono1 = $scope.ambienteTitular.titular.telefonos[0];
                var telefono2 = $scope.ambienteTitular.titular.telefonos[1];
                var numberRex = /(\d{3,4})(\d{7})/;
                
                if (telefono1) {
                    telefono1 = telefono1.match(numberRex);
                    if (telefono1) {
                        if (telefono1[1].length == 3) {
                            $scope.ambienteTitular.titular.codArea1 = codAreasPorCod("0" + telefono1[1]);
                        } else {
                            $scope.ambienteTitular.titular.codArea1 = codAreasPorCod(telefono1[1]);
                        }
                        $scope.ambienteTitular.titular.telefono1 = telefono1[2].substring(0,3)+"-"+telefono1[2].substring(3,7);
                    }
                }
                
                if (telefono2) {
                    telefono2 = telefono2.match(numberRex);
                    if (telefono2) {
                        if (telefono2[1].length == 3) {
                            $scope.ambienteTitular.titular.codArea2 = codAreasPorCod("0" + telefono2[1]);
                        } else {
                            $scope.ambienteTitular.titular.codArea2 = codAreasPorCod(telefono2[1]);
                        }
                        $scope.ambienteTitular.titular.telefono2 = telefono2[2].substring(0,3)+"-"+telefono2[2].substring(3,7);
                        
                    }
                }
            };
           
            $state.go('siniestro.vehiculo');
    }]);

    siniestroControllers.controller('SiniestroConfirmarCtr', ['$scope', 'SiniestroService', '$state', '$modalInstance', function ($scope, SiniestroService, $state, $modalInstance) {   
       
        $scope.emitir = function(){
            $modalInstance.close(true);
        };

        $scope.cancelar = function(){
            $modalInstance.close(false);
        };
    }]);

    siniestroControllers.controller('SiniestroFinalizarCtr', ['$scope', '$state', '$modalInstance',
        function($scope, $state, $modalInstance){           
            $scope.nuevoSiniestro = function(){
                $modalInstance.close(true);
                $state.transitionTo('siniestro', null, { 
                    reload: true, inherit: false, notify: true
                });
            };

            $scope.inicio = function() {
                $modalInstance.close(true);
                $state.go('home');
            };

            $scope.cerrar = function(){
                $modalInstance.close();
            };
        }
    ]);

    siniestroControllers.controller('SiniestroVehiculoCtr', ['$scope','mensaje','SiniestroService', 'ngTableParams', '$filter',
        function($scope, mensaje, SiniestroService, ngTableParams, $filter){
            $scope.$parent.pasoActivo = 0;
            $scope.$parent.ambienteVehiculo.mostrar = false;
            $scope.tiposId = ['Venezolano', 'Extranjero', 'Pasaporte', 'Jurídico', 'Gubernamental'];

            
            $scope.polizas = function () {
                return $scope.ambienteVehiculo.polizas;
            };
            
            $scope.datosFiltro = { //Filtros agregados 11/08/16
                'numpol' : ""

            };


            $scope.pintarTabla = function () {
                $scope.tableParams = new ngTableParams({
		    page:1,
		    count:10,
		    sorting:{
                        numpol:'desc'
		    }
                }, {
		    total: function () { return $scope.polizas().length; }, // length of data
		    getData: function($defer, params) {
                        var filteredData = params.filter() ?
                            $filter('filter')($scope.polizas(), params.filter()) : $scope.polizas();
                        
                        var orderedData = params.sorting() ?
                            $filter('orderBy')(filteredData, params.orderBy()) : filteredData;
                        
                        params.total(orderedData.length);
                        $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                        
		    },
                    $scope: {$data:{}}
                });
            };

             $scope.filtrar = function () {
            $scope.tableParams.filter({'numpol':$scope.datosFiltro.numpol});
        };

            if ($scope.ambienteVehiculo.polizas) {
                $scope.pintarTabla();
            }
            $scope.polizaSeleccionada = function (numpol) {
                var clase = "";
                if ($scope.ambienteVehiculo.polizas && $scope.ambienteVehiculo.polizaSeleccionada != undefined) {
                    if ($scope.ambienteVehiculo.polizaSeleccionada.numpol == numpol) {
                        clase = "active";
                    };
                };
                return clase;
            };
            
            $scope.datosGenerados = function() {
                angular.forEach($scope.ambienteVehiculo.polizas, function(value, key){
                    var fechIni = value.fecinivig;
                    var fechFin = value.fecfinvig;
                    var nombre = value.nomter ? value.nomter : '';
                    var apellido = value.apeter ? value.apeter : '';
                    value.fecinivig = Date.parse(fechIni);
                    value.fecfinvig = Date.parse(fechFin);
                    value.cliente = nombre + ' ' + apellido;
                    value.numpol = parseInt(value.numpol);
                });
            };

            $scope.obtenerVehiculos = function () {
                if($scope.form.valid()){
                    var datos = $scope.ambienteVehiculo.datosBusqueda;
                    SiniestroService.obtenerPolizas.execute({
                        'ccodusuario' : 'BMRIVAS',
                        'cnumplaca': datos.placa ? datos.placa : null,
                        'cfechaocurr': datos.fechaSiniestro,
                        'ccedula': datos.cedula ? datos.tipoId.substring(0,1)+datos.cedula : null,
                        'nnumpol': datos.poliza ? datos.poliza : null
                    }, function(response){
                        if (response.poliza_siniestro_cur.length != 0) {
                            $scope.$parent.ambienteVehiculo.mostrar = true;
                            $scope.ambienteVehiculo.polizaSeleccionada = undefined;
                            $scope.$parent.ambienteVehiculo.polizas = response.poliza_siniestro_cur;
                            
                            $scope.datosGenerados();
                            if ($scope.tableParams){
                                $scope.tableParams.reload();
                            } else {
                                $scope.pintarTabla();
                            };
                        } else {
                            mensaje.info("No existen pólizas asociadas a estos datos");
                            $scope.ambienteVehiculo.polizas = undefined;
                        }
                    }, function(response){
                        mensaje.info("No existen pólizas asociadas a estos datos");
                        $scope.ambienteVehiculo.polizas = undefined;
                    });
                }
            };

            $scope.verificarData = function () {
                if ($scope.ambienteVehiculo.mostrar && $scope.ambienteVehiculo.polizas) {
                    $scope.$parent.ambienteVehiculo.mostrar = false;
                };
            };
            
            $scope.limpiarDatos = function(){
                $scope.$parent.ambienteVehiculo.datosBusqueda.cedula = undefined;
                $scope.$parent.ambienteVehiculo.datosBusqueda.poliza = undefined;
                $scope.$parent.ambienteVehiculo.datosBusqueda.placa = undefined;
            };

            $scope.seleccionarPoliza = function(poliza) {
                $scope.$parent.ambienteVehiculo.polizaSeleccionada = undefined;
                $scope.$parent.ambienteVehiculo.polizaSeleccionada = poliza;
                $(".next").click();
            };
    }]);

    siniestroControllers.controller('SiniestroTitularCtr', ['$scope',
        function($scope){
            $scope.$parent.pasoActivo = 1;
            $('.phone').mask("999-9999");
            //$('.phone').mask("999?9-9999999");
        }]);

    siniestroControllers.controller('SiniestroConductorCtr', ['$scope', 'mensaje', 'SiniestroService',
        function($scope, mensaje, SiniestroService){
            $scope.$parent.pasoActivo = 2;
            $('.date').mask("99/99/9999");
            $('.phone').mask("999-9999");
            $('.time').mask("99:99");
            
            $scope.esTitular = function() {
                $scope.$parent.ambienteConductor.conductor.tipoId  = $scope.$parent.ambienteTitular.titular.tipoId;
                $scope.$parent.ambienteConductor.conductor.numId  = $scope.$parent.ambienteTitular.titular.numId;
                $scope.$parent.ambienteConductor.conductor.nombre  = $scope.$parent.ambienteTitular.titular.nombre;
                $scope.$parent.ambienteConductor.conductor.apellidos  = $scope.$parent.ambienteTitular.titular.apellidos;
                $scope.$parent.ambienteConductor.conductor.edocivil = $scope.$parent.ambienteTitular.titular.edoCivil;
                $scope.$parent.ambienteConductor.conductor.sexo  = $scope.$parent.ambienteTitular.titular.sexo;      
                $scope.$parent.ambienteConductor.conductor.edocivil  = $scope.$parent.ambienteTitular.titular.edocivil;
                $scope.$parent.ambienteConductor.conductor.codArea = $scope.$parent.ambienteTitular.titular.codArea1;
                $scope.$parent.ambienteConductor.conductor.telefono = $scope.$parent.ambienteTitular.titular.telefono1;
                $scope.$parent.ambienteConductor.conductor.fechaNacimiento  = $scope.$parent.ambienteTitular.titular.fechaNacimiento;
                $scope.$parent.ambienteConductor.conductor.parentesco = $scope.parentescoTitular($scope.$parent.ambienteConductor.conductor.sexo);
                $scope.$parent.ambienteConductor.conductor.licencia = 'S';
            };
            
            $scope.parentescoTitular = function (sexo) {
                var parentesco = undefined;
                if (sexo == $scope.$parent.sexos[0]) {
                    parentesco = $scope.parentescoPorId('0002');
                } else {
                    parentesco = $scope.parentescoPorId('0001');
                };
                return parentesco;
            };

            $scope.parentescoPorId = function(cod) {
                for (var i=0; i < $scope.ambienteConductor.parentescos.length; i++) {
                    if (cod == $scope.ambienteConductor.parentescos[i].codlval) {
                        return $scope.ambienteConductor.parentescos[i];
                    };
                };
            };
            
            $scope.buscarAsegurado = function () {
                SiniestroService.tercero.execute({
                    'p_tipoid': $scope.$parent.ambienteConductor.conductor.tipoId.substring(0,1), 'p_numid': parseInt($scope.ambienteConductor.conductor.numId),
                    'p_dvid': '0'
                }, function (asegurado) {
                    if (asegurado.c_solicitante.length){                    
                        $scope.$parent.ambienteConductor.conductor.telefonos = [];
                        $scope.$parent.ambienteConductor.conductor.nombre = asegurado.c_solicitante[0].nomter;
                        $scope.$parent.ambienteConductor.conductor.apellidos = asegurado.c_solicitante[0].apeter;
                        $scope.$parent.ambienteConductor.conductor.fechaNacimiento = asegurado.c_solicitante[0].fecnac;
                        $scope.$parent.ambienteConductor.conductor.sexo = sexoPorInicial(asegurado.c_solicitante[0].sexo);
                        $scope.$parent.ambienteConductor.conductor.edocivil = edoCivilPorInicial(asegurado.c_solicitante[0].edocivil);
                        $scope.$parent.ambienteConductor.conductor.parentesco = undefined;

                        
                        $scope.$parent.ambienteConductor.conductor.buscado = true;
                        $scope.$parent.ambienteConductor.conductor.acsel = true;
                        
                        $scope.$parent.ambienteConductor.conductor.telefonos[0] = asegurado.c_solicitante[0].telef1;
                        iniciarTelefono();
                        
                    } else {
                        var numId = $scope.$parent.ambienteConductor.conductor.numId;
                        $scope.limpiar();
                        $scope.$parent.ambienteConductor.conductor.numId = numId;
                        $scope.$parent.ambienteConductor.conductor.buscado = true;
                        $scope.$parent.ambienteConductor.conductor.acsel = false;
                    }
	        },function (response) {
		    mensaje.errorRed('Personas',response.status,true);
	        });
            };

            function edoCivilPorInicial(inicial) {
                for (var edoCivil = 0; edoCivil < $scope.$parent.edosCivil.length; edoCivil++) {
                    if ($scope.$parent.edosCivil[edoCivil].substring(0,1) == inicial) {
                        return $scope.$parent.edosCivil[edoCivil];
                    }
                };
            };
            
            function sexoPorInicial(inicial) {
                for (var i = 0; i < $scope.sexos.length; i++) {
                    if ($scope.sexos[i].substring(0,1) == inicial) {
                        return $scope.sexos[i];
                    }
                };
            };
            
            function codAreasPorCod(code) {
                for (var codigo = 0; codigo < $scope.codAreas.length; codigo++) {
                    if ($scope.codAreas[codigo].codtelefono == code) {
                        return $scope.codAreas[codigo];
                    }	
                }
            };

            function iniciarTelefono () {
                var telefono1 = $scope.ambienteConductor.conductor.telefonos[0];
                var numberRex = /(\d{3,4})(\d{7})/;
                
                if (telefono1) {
                    telefono1 = telefono1.match(numberRex);
                    if (telefono1) {
                        if (telefono1[1].length == 3) {
                            $scope.ambienteConductor.conductor.codArea = codAreasPorCod("0" + telefono1[1]);
                        } else {
                            $scope.ambienteConductor.conductor.codArea = codAreasPorCod(telefono1[1]);
                        }
                        $scope.ambienteConductor.conductor.telefono = telefono1[2].substring(0,3)+"-"+telefono1[2].substring(3,7);
                    }
                }
                
            };

            $scope.limpiar = function(){
                $scope.$parent.ambienteConductor.conductor.numId  = "";
                $scope.$parent.ambienteConductor.conductor.nombre  = "";
                $scope.$parent.ambienteConductor.conductor.apellidos  = "";
                $scope.$parent.ambienteConductor.conductor.sexo  = undefined;
                $scope.$parent.ambienteConductor.conductor.edocivil  = undefined;
                $scope.$parent.ambienteConductor.conductor.parentesco  = undefined;
                $scope.$parent.ambienteConductor.conductor.licencia  = undefined;
                $scope.$parent.ambienteConductor.conductor.codArea = "";
                $scope.$parent.ambienteConductor.conductor.telefono = "";
                $scope.$parent.ambienteConductor.conductor.fechaNacimiento  = "";
                $scope.$parent.ambienteConductor.conductor.acsel = false;
            };

            $scope.iniciarVelocidad = function () {
                $scope.$parent.ambienteConductor.siniestro.velocidad = 0;
            };

            if (($scope.$parent.ambienteConductor.conductor.esTitular === undefined) || ($scope.$parent.ambienteConductor.conductor.esTitular == 'S')) {
                $scope.$parent.ambienteConductor.conductor.esTitular = 'S';
                $scope.esTitular();
                $scope.iniciarVelocidad();
            } 
            
            $scope.verificarCedula = function(){
                if (($scope.$parent.ambienteTitular.titular.numId == $scope.$parent.ambienteConductor.conductor.numId) && ($scope.$parent.ambienteTitular.titular.tipoId == $scope.$parent.ambienteConductor.conductor.tipoId)) {
                    $scope.esTitular();
                    $scope.$parent.ambienteConductor.conductor.esTitular = 'S';
                } else {
                    $scope.buscarAsegurado();
                };
            };

            $scope.cambioEstado = function (){
                $scope.ambienteConductor.siniestro.ciudad = undefined;
                $scope.ambienteConductor.siniestro.municipio = undefined;
            };
        
            $scope.cambioCiudad = function (){
                $scope.ambienteConductor.siniestro.municipio = undefined;
            };

            $scope.cambioTipoDano = function () {
                if ($scope.$parent.ambienteConductor.siniestro.tipoDano.codigo == 'RO') {
                    $scope.$parent.ambienteConductor.siniestro.autoridadesEscena = null;
                    $scope.$parent.ambienteConductor.siniestro.vehiculoDetenido = null ;
                    $scope.$parent.ambienteConductor.siniestro.vehiculoRueda = null;
                    $scope.$parent.ambienteConductor.siniestro.roboAccesorios = null;
                    $scope.$parent.ambienteConductor.siniestro.vehiculoEstacionado = null;
                    $scope.$parent.ambienteConductor.siniestro.velocidad = 0;
                    $scope.$parent.ambienteConductor.siniestro.danosTerceros = null;
                    $scope.$parent.ambienteConductor.siniestro.danosCorporales = null;
                    $scope.$parent.ambienteDanos.danosTerceros = null;
                    $scope.$parent.ambienteDanos.danos = 'ROBO O HURTO DE VEHICULO';
                    if ($scope.$parent.ambienteDanos.piezas) {
                        for(var i = 0; i < $scope.$parent.ambienteDanos.piezas.length; i++) {
                            $scope.$parent.ambienteDanos.piezas[i].sel = false;
                        };
                    };
                    $scope.$parent.ambienteDanos.piezasLeibles = "";
                } else {
                    if ($scope.ambienteDanos.danos == 'ROBO O HURTO DE VEHICULO') {
                        $scope.$parent.ambienteDanos.danos = null;
                    };
                };
            };
            
            $scope.verificarParentesco = function () {
                if ($scope.ambienteConductor.conductor.esTitular != 'S') {
                    if ($scope.ambienteConductor.conductor.parentesco.codlval == '0001' || $scope.ambienteConductor.conductor.parentesco.codlval == '0002') {
                        $scope.$parent.ambienteConductor.conductor.parentesco = undefined;
                    }
                };
            };
        }]);
    
    siniestroControllers.controller('SiniestroDanosCtr', ['$scope', function($scope){
        $scope.$parent.pasoActivo = 3;
        if ($scope.$parent.ambienteDanos.piezas == undefined) {
            $scope.$parent.ambienteDanos.piezas = [
                {nombre: 'Parachoque Delantero', posicion:1, numero:1, sel: false},
                {nombre: 'Faro Derecho', posicion:2, numero:2, sel: false},
                {nombre: 'Faro Izquierdo', posicion:3, numero:3, sel: false},
                {nombre: 'Parrilla', posicion:1, numero:4, sel: false},
                {nombre: 'Capot', posicion:1, numero:5, sel: false}, 
                {nombre: 'Guardafango Delantero Izquierdo',posicion:3, numero:6, sel: false}, 
                {nombre: 'Guardafango Delantero Derecho', posicion:2, numero:7, sel: false},
                {nombre: 'Techo', posicion:1, numero:8, sel: false},
                {nombre: 'Puerta Delantera Izquierda', posicion:3, numero:9, sel: false},
                {nombre: 'Puerta Trasera Izquierda', posicion:3, numero:10, sel: false},
                {nombre: 'Puerta Delantera Derecha', posicion:2, numero:11, sel: false},
                {nombre: 'Puerta Trasera Derecha', posicion:2, numero:12, sel: false},
                {nombre: 'Tapa Maleta', posicion:2, numero:13, sel: false},
                {nombre: 'Guardafango Trasero Izquierdo', posicion:3, numero:14, sel: false},
                {nombre: 'Guardafango Trasero Derecho', posicion:2, numero:15, sel: false},
                {nombre: 'Stop Derecho', posicion:2, numero:16, sel: false},
                {nombre: 'Stop Izquierdo', posicion:3, numero:17, sel: false},
                {nombre: 'Parachoque Trasero', posicion:1, numero:18, sel: false},
                {nombre: 'Vidrio Delantero Frontal', posicion:1, numero:19, sel: false},
                {nombre: 'Vidrio Delantero Derecho', posicion:3, numero:20, sel: false},
                {nombre: 'Vidrio Delantero Izquierdo', posicion:2, numero:21, sel: false},
                {nombre: 'Vidrio Trasero Derecho', posicion:3, numero:22, sel: false},
                {nombre: 'Vidrio Trasero Izquierdo', posicion:2, numero:23, sel: false},
                {nombre: 'Vidrio Trasero Frontal', posicion:1, numero:24, sel: false}
            ];
        
            $scope.$parent.ambienteDanos.piezasLeibles = "";
        }

        $scope.mostrarDanosPersonas = function () {            
            var tipoDano = $scope.ambienteConductor.siniestro.tipoDano.codigo == 'RO' ? false : true;
            var danosTerceros = $scope.ambienteConductor.siniestro.danosTerceros == 'S'? true: false;
            var danosCorporales = $scope.ambienteConductor.siniestro.danosCorporales == 'S'? true: false;
            
            var res = false;
            if (tipoDano) {
                if (danosTerceros || danosCorporales) {
                    res = true;
                };
            };
            return res;
        };
        
        $scope.piezasActualizar = function () {
            var piezas = [];
            for (var i = 0; i < $scope.ambienteDanos.piezas.length; i++) {
                if ($scope.ambienteDanos.piezas[i].sel) {
                    piezas.push($scope.ambienteDanos.piezas[i].nombre);
                };
            };
            $scope.$parent.ambienteDanos.piezasLeibles = piezas.join(", ");
        };
    }]);

    siniestroControllers.controller('SiniestroResumenCtr', ['$scope',
        function($scope){
            $scope.$parent.pasoActivo = 4;

            $scope.mostrarDanosPersonas = function () {            
                var tipoDano = $scope.ambienteConductor.siniestro.tipoDano.codigo == 'RO' ? false : true;
                var danosTerceros = $scope.ambienteConductor.siniestro.danosTerceros == 'S'? true: false;
                var danosCorporales = $scope.ambienteConductor.siniestro.danosCorporales == 'S'? true: false;
                
                var res = false;
                if (tipoDano) {
                    if (danosTerceros || danosCorporales) {
                        res = true;
                    };
                };
                return res;
            };
            
    }]);

    siniestroControllers.controller('SiniestroResultadoCtr', ['$scope', 'SiniestroService', '$state', 
        function ($scope, SiniestroService, $state) {   
            $scope.$parent.pasoActivo = 5;
    }]);
});
