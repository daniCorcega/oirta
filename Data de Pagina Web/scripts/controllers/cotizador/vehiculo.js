define(['angular'], function (angular) {
    'use strict';
    var cotizadorVehiculoControllers = angular.module('cotizadorVehiculoControllers', ['ngTable']);
    cotizadorVehiculoControllers.controller('CotizadorVehiculoListaCtr', ['$scope', 'CotizadorVehiculoService','ngTableParams', '$filter','mensaje',
        function ($scope, CotizadorVehiculoService, ngTableParams, $filter, mensaje) {
            CotizadorVehiculoService.cotizacionesCompletas.execute({
                "i_CodUsr": "BMRIVAS"
            }, function (data) {
                $scope.cotizaciones = data.cotizaciones_cur;
                jQuery.map($scope.cotizaciones,function (cotizacion, i) {
                    $scope.cotizaciones[i].prima = parseFloat(cotizacion.prima);
                    $scope.cotizaciones[i].solicitante = $scope.cotizaciones[i].nombre + " " + $scope.cotizaciones[i].apellido;
                  });
                $scope.tableParams = new ngTableParams({
                    page: 1,            
                    count: 10,
                    sorting: {
                        nrosolic:'desc'
                    }
                }, {
                    total: $scope.cotizaciones.length, // length of data
                    getData: function($defer, params) {
                        var filteredData = params.filter() ?
                                $filter('filter')($scope.cotizaciones, params.filter()) : $scope.cotizaciones;
                        
                        var orderedData = params.sorting() ? 
                                $filter('orderBy')(filteredData, params.orderBy()) : filteredData;
                        
                        params.total(orderedData.length);
                        $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                    }
                });
            }, function (response) {
                mensaje.errorRed('Cargando Cotizaciones',response.status);
            });

            $scope.enviarCotizacion = function (nrosolic) {
                for (var i = 0; i < $scope.cotizaciones.length; i++) {
                    if ($scope.cotizaciones[i].nrosolic == nrosolic) {
                        mensaje.enviarCotizacion($scope.cotizaciones[i].nrosolic,$scope.cotizaciones[i].solicitante);
                        break;
                    };
                };
                
                
            };
        }]);

    cotizadorVehiculoControllers.controller('CotizadorVehiculoCtr', ['$scope', 'CotizadorVehiculoService', '$state', '$modal', 'mensaje',
        function($scope, CotizadorVehiculoService, $state, $modal, mensaje){
            $scope.title = 'Cotizador Vehículos';
            $scope.tiposId = ['Venezolano', 'Extranjero', 'Pasaporte', 'Jurídico', 'Gubernamental'];
            $scope.sexos = ['Femenino', 'Masculino'];
            $scope.anios = [];
            $scope.numSolicitud = null;
            $scope.ambiente_solicitante = Object();
            $scope.ambiente_vehiculo = Object();
            $scope.solicitante = Object();
            $scope.solicitante.tipoId = $scope.tiposId[0];
            $scope.solicitante.exists = false;
            $scope.vehiculo = Object();
            $scope.vehiculo.cerokm = false;
            $scope.descuento = 0;
            $scope.coberturaPedida = false;
            $scope.ambientePlan = Object();
            $scope.ambientePlan.errores = 0;
            $scope.ambientePlan.cargadas = 0;
            $scope.ambientePlan.cargado = 0;
            $scope.ambientePlan.mayorPrima = Object();
            $scope.ambientePago = Object();
            $scope.ambienteActivo = 0;
            var $w1finish = $('#w1').find('ul.pager li.finish'),
            $w1validator = $("#w1 form").validate({
                highlight: function (element) {
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
                    email: {
                        email: true
                    },
                    solicitanteNumId: {
                        digits: true,
                        required: function(element) {
                            var result = false;
                            if (element.value.length != 0) result = true;
                            return result;
                        },
                        minlength: function(element) {
                            var result = 0;
                            if (element.value.length != 0) result = 6;
                            return result;
                        },
                        maxlength: 9
                    },
                    fechaNacimiento: true,
                    estado: true,
                    sexo:true
                },
                messages: {
                    nombre: "Por favor introduzca su nombre",
                    apellidos: "Por favor introduzca su apellido",
                    email: {
                        required: "Por favor introduzca su email",
                        email: "Su email debe ser de la forma nombre@dominio.com"
                    },
                    solicitanteNumId: {
                        required: "Por favor introduzca su número de identificación",
                        digits: "Solo puede agregar valores válidos para identificaciones (números)",
                        minlength: "El número de identificación introducido es muy corto",
                        maxlength: "El número de identificación introducido es muy largo"
                    },
                    solicitanteTipoId: "Seleccione Cedula o Rif",
                    nacimiento: "Por favor introduzca su fecha de nacimiento",
                    estado: "Seleccione un estado",
                    codArea1: "Usted debe introducir el codigo del numero de telefono",
                    codArea2: "Usted debe introducir el codigo del numero de telefono"
                }
            });

            $w1finish.on('click', function (ev) {
                ev.preventDefault();
                var validated = $('#w1 form').valid();
                if (validated) {
                    finalizar();
                }
            });

            $('#w1').bootstrapWizard({
                tabClass: 'wizard-steps',
                nextSelector: 'ul.pager li.next',
                previousSelector: 'ul.pager li.previous',
                firstSelector: null,
                lastSelector: null,
                onPrevious: function (tab, navigation, index) {
                    var states = {
                        0 : "cotizadorvehiculo.solicitante",
                        1 : "cotizadorvehiculo.vehiculo",
                        2 : "cotizadorvehiculo.planes",
                        3 : "cotizadorvehiculo.pago",
                        4 : "cotizadorvehiculo.resumen"
                    };
                    $state.go(states[index]);
                },
                onNext: function (tab, navigation, index, newindex) {
                    var validated = $('#w1 form').valid();
                    if (!validated) {
                        $w1validator.focusInvalid();
                        return false;
                    }
                    switch (index) {
                        case 1:
                        CotizadorVehiculoService.cotizacionSolicitante.execute({
                            'io_nrosolic' : $scope.numSolicitud,
                            'i_tipoid' : $scope.solicitante.tipoId.substring(0,1),
                            'i_numid' : $scope.solicitante.numId,
                            'i_nombre' : $scope.solicitante.nombre,
                            'i_apellido' : $scope.solicitante.apellidos,
                            'i_fecnac' : $scope.solicitante.fechaNacimiento,
                            'i_sexo': $scope.solicitante.sexo.substring(0,1),
                            'i_edocivil' : $scope.solicitante.edocivil,
                            'i_codestado' : $scope.solicitante.estado.codestado,
                            'i_codciudad' : $scope.solicitante.codciudad ? $scope.solicitante.codciudad : null,
                            'i_codmunicipio' : $scope.solicitante.codmunicipio ? $scope.solicitante.codmunicipio : null,
                            'i_codurbanizacion' : $scope.solicitante.codurbanizacion ? $scope.solicitante.codurbanizacion : null,
                            'i_direccion' : $scope.solicitante.direccion,
                            'i_email' : $scope.solicitante.email,
                            'i_profesion' : $scope.solicitante.profesion,
                            'i_telefono1' : $scope.solicitante.codArea1.codtelefono + $scope.solicitante.telefono1.substring(0,3) + $scope.solicitante.telefono1.substring(4,8),
                            'i_telefono2' : $scope.solicitante.codArea2.codtelefono + $scope.solicitante.telefono2.substring(0,3) + $scope.solicitante.telefono2.substring(4,8)
                            
                            }, function (data) {
                                $scope.numSolicitud = data.io_nrosolic;
                                $scope.solicitante.numSolicitud = data.io_nrosolic; //TODO: Se debe mejorar esto. Solución temporal
                            }, function (response) {
			                    mensaje.errorRed('Guardando Persona',response.status,true);
			                });
                            $state.go('cotizadorvehiculo.vehiculo');
                            break;
                        case 2:
                            CotizadorVehiculoService.cotizacionVehiculo.execute({
                                'io_nrosolic' : $scope.solicitante.numSolicitud, //TODO: esto no debería estar aquí...
                                'i_codmarca' : $scope.vehiculo.marca.valor,
                                'i_codmodelo' : $scope.vehiculo.modelo.codmodelo,
                                'i_codversion' : $scope.vehiculo.version.valor,
                                'i_anoveh' : $scope.vehiculo.anio,
                                'i_indcerokm' : $scope.vehiculo.cerokm ? "S" : "N"
                            }, function (data) {
                                $scope.numSolicitud = data.io_nrosolic;
                            }, function (response) {
			        mensaje.errorRed('Guardando Vehículo',response.status,true);
			    });
                            $state.go('cotizadorvehiculo.planes');
                            break;
                        case 3:
                             CotizadorVehiculoService.cotizacionCobertura.execute({
                                 'i_nrosolic': $scope.solicitante.numSolicitud, //TODO: esto no debería estar aquí...
                                    "i_codprod": $scope.ambientePlan.planSeleccionado.codprod,
                                    "i_id_cob_obligatoria": $scope.ambientePlan.planSeleccionado.idCobertObligatoria,
                                    "i_id_cob_adicional": $scope.ambientePlan.planSeleccionado.idCobertAdicional
                                }, function () {
                                    return null;
                                }, function (response) {
                                    mensaje.errorRed('Guardando Coberturas Seleccionadas',response.status,true);
                                });
                            $state.go('cotizadorvehiculo.pago');
                            break;
                        case 4:
                            CotizadorVehiculoService.guardarFinanciamiento.execute({
                                'i_nrosolic': $scope.solicitante.numSolicitud, //TODO: esto no debería estar aquí...
                                'i_codplan': $scope.ambientePago.pagoSeleccionado.ideplan,
                                'i_modplan': $scope.ambientePago.pagoSeleccionado.ideplan,
                                'i_porcinicial': $scope.ambientePago.pagoSeleccionado.porcinicial ? parseFloat($scope.ambientePago.pagoSeleccionado.porcinicial) : 0,
                                'i_mtoinicial': parseFloat($scope.ambientePago.pagoSeleccionado.inicial_prima),
                                'i_mtogiros': $scope.ambientePago.pagoSeleccionado.mtogiro ? parseFloat($scope.ambientePago.pagoSeleccionado.mtogiro) : 0,
                                'i_cantgiros': $scope.ambientePago.pagoSeleccionado.cantgiros ? parseInt($scope.ambientePago.pagoSeleccionado.cantgiros) : 0,
                                'i_indfinan': $scope.ambientePago.pagoSeleccionado.tipoplan == 'F' ? 'S' : 'N'
                            });
                            // Mejorar la manera en que se guarda Descuento
                            if ($scope.ambientePlan.planSeleccionado.descuento > 0) {
                                CotizadorVehiculoService.guardarDescuento.execute({
                                    'i_nrosolic': $scope.solicitante.numSolicitud, //TODO: esto no debería estar aquí...
                                    'i_porcdcto': $scope.ambientePlan.planSeleccionado.descuento
                                });
                            };
                            $state.go('cotizadorvehiculo.resumen');
                            break;
                        default:
                            break;
                    };
                },
                onTabClick: function (tab, navigation, index, newindex) {
                    var states = {
                        0 : "cotizadorvehiculo.solicitante",
                        1 : "cotizadorvehiculo.vehiculo",
                        2 : "cotizadorvehiculo.planes",
                        3 : "cotizadorvehiculo.pago",
                        4 : "cotizadorvehiculo.resumen"
                    };
                    if (newindex == index + 1) {
                        return this.onNext(tab, navigation, index+1, newindex);
                    } else if (newindex > index + 1) {
                        return false;
                    } else {
                        $state.go(states[newindex]);
                    }
                },
                onTabChange: function (tab, navigation, index, newindex) {
                    var totalTabs = navigation.find('li').size() - 1;
                    $w1finish[newindex != totalTabs ? 'addClass' : 'removeClass']('hidden');
                    $('#w1').find(this.nextSelector)[newindex == totalTabs ? 'addClass' : 'removeClass']('hidden');
                }
            });

            var finalizar = function() {
                var modalInstance = $modal.open({
                    templateUrl: 'views/cotizador/vehiculo/finalizar_cotizacion.html',
                    controller: 'CotizadorVehiculoFinalizar',
                    scope: $scope
                });
            };

            $state.go('cotizadorvehiculo.solicitante');
        }]);

    cotizadorVehiculoControllers.controller('CotizadorVehiculoFinalizar', ['$scope', '$state', '$modalInstance', '$timeout', 'emitirCotizacion',
        function($scope, $state, $modalInstance, $timeout, emitirCotizacion){
            
            $scope.nuevaPoliza = function(){
                $modalInstance.close(true);
                $state.transitionTo('cotizadorvehiculo', null, { 
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

    cotizadorVehiculoControllers.controller('CotizadorVehiculoSolicitanteCtr', ['$scope', 'CotizadorVehiculoService', 'mensaje',
	    function($scope, CotizadorVehiculoService, mensaje){
            $scope.$parent.ambienteActivo = 0;
            if (!$scope.$parent.ambiente_solicitante.estados) {
                CotizadorVehiculoService.estado.execute(null,
                function (data) {
		            $scope.estados = data.estado_cur;
                    $scope.$parent.ambiente_solicitante.estados = data.estado_cur;
                    $scope.initEstados = 1;
                }, 
                function (response) {
		            mensaje.errorRed('Cargando Estados',response.status,true);
		        });
            } else {
                $scope.estados = $scope.$parent.ambiente_solicitante.estados;
                $scope.codAreas = $scope.$parent.ambiente_solicitante.codAreas;
            };

            $scope.solicitante = $scope.$parent.solicitante;
            $scope.telefonos = [0,0];
            $('#date').mask("99/99/9999");
            $('.phone').mask("999-9999");

            if ($scope.solicitante.numId) {
                if ($scope.solicitante.exists) {
                    $scope.userexists = true;
                }
                $scope.telefonos[0] = $scope.solicitante.codArea1.codtelefono+$scope.solicitante.telefono1;
                $scope.telefonos[0] = ($scope.telefonos[0]).substring(1,11);

                $scope.telefonos[1] = $scope.solicitante.codArea2.codtelefono+$scope.solicitante.telefono2;
                $scope.telefonos[1] = $scope.telefonos[1].substring(1,11);
            }

                function sexoPorInicial(inicial) {
                    for (var i = 0; i < $scope.$parent.sexos.length; i++) {
                        if ($scope.$parent.sexos[i].substring(0,1) == inicial) {
                            return $scope.$parent.sexos[i];
                        }
                    }
                };

            $scope.buscarAsegurado = function () {
                CotizadorVehiculoService.tercero.execute({
                    'p_tipoid': $scope.solicitante.tipoId.substring(0,1), 'p_numid': parseInt($scope.solicitante.numId),
                    'p_dvid': '0'
                }, function (data) {
		            return null;
		        },function (response) {
		            mensaje.errorRed('Cargando Personas',response.status,true);
		        }).$promise.then(
                    function (asegurado) {
                        if (asegurado.c_solicitante.length){
                            $scope.userexists = true;
                            $scope.solicitante.exists = true;
                            $scope.solicitante.nombre = asegurado.c_solicitante[0].nomter;
                            $scope.solicitante.apellidos = asegurado.c_solicitante[0].apeter;
                            $scope.solicitante.fechaNacimiento = asegurado.c_solicitante[0].fecnac;
                            $scope.solicitante.sexo = sexoPorInicial(asegurado.c_solicitante[0].sexo);
                            $scope.solicitante.edocivil = asegurado.c_solicitante[0].edocivil;
                            $scope.solicitante.estado = estadoPorID(asegurado.c_solicitante[0].codestado,$scope);
                            $scope.solicitante.codciudad = asegurado.c_solicitante[0].codciudad;
                            $scope.solicitante.codmunicipio = asegurado.c_solicitante[0].codmunicipio;
                            $scope.solicitante.codurbanizacion = asegurado.c_solicitante[0].codurbanizacion;
                            $scope.solicitante.direccion = asegurado.c_solicitante[0].direc;
                            $scope.solicitante.email = asegurado.c_solicitante[0].email;
                            $scope.solicitante.profesion = asegurado.c_solicitante[0].codact;
                            $scope.telefonos[0] = asegurado.c_solicitante[0].telef1;
                            $scope.telefonos[1] = asegurado.c_solicitante[0].telef2;
                            $scope.buscarCodAreas();
                            $scope.selected = $scope.solicitante.sexo == "M";
                        } else {
                            var numId = $scope.solicitante.numId;
                            $scope.iniciarFormulario();
                            $scope.solicitante.numId = numId;
                        }
                });
            };

            $scope.clicked = function () {
                $('[data-provide=datepicker]').focus();
            };
            $scope.limpiarFormulario = function () {
                if ($scope.userexists) {
                    $scope.iniciarFormulario();
                }
            };

            $scope.iniciarFormulario = function () {
                $scope.userexists = false;
                $scope.solicitante.exists = false;
                $scope.solicitante.numId = "";
                $scope.solicitante.nombre = "";
                $scope.solicitante.apellidos = "";
                $scope.solicitante.email = "";
                $scope.solicitante.fechaNacimiento = "";
                $scope.solicitante.telefono1 = "";
                $scope.solicitante.telefono2 = "";
                $scope.solicitante.estado = "";
                $scope.codAreas = [];
                $scope.telefonos = [0,0];	
            };

            $scope.buscarCodAreas = function () {
                CotizadorVehiculoService.codArea.execute({
                    'c_codestado': $scope.solicitante.estado.codestado
                }, 
                function () {
		            return null;
		        }, 
                function (response) {
		            mensaje.errorRed('Cargando Códigos de Áreas',response.status,true);
		        }).$promise.then(
                function (data) {
                    $scope.codAreas = data.codtele_cur;
                    $scope.$parent.ambiente_solicitante.codAreas = data.codtele_cur;
                    $scope.initEstado = 1;
                });
            };

            function estadoPorID(id) {
                for (var estado = 0; estado < $scope.estados.length; estado++) {
                    if ($scope.estados[estado].codestado == id) {
                        return $scope.estados[estado];
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

            $scope.$watch('initEstados',function () {
                if ($scope.initEstados == 1) {
                    $scope.initEstados = 2;
                    if ($scope.solicitante.estado) {
                        $scope.solicitante.estado = estadoPorID($scope.solicitante.estado.codestado,$scope);
                        $scope.buscarCodAreas();
                    }
                }
            });

            $scope.$watch('initEstado', function() {
                if ($scope.initEstado == 1) {
                    $scope.initEstado = 2;
                    var telefono1 = $scope.telefonos[0];
                    var telefono2 = $scope.telefonos[1];
                    var numberRex = /(\d{3,4})(\d{7})/;

                    if (telefono1) {
                        telefono1 = telefono1.match(numberRex);
                        if (telefono1) {
                            if (telefono1[1].length == 3) {
                                $scope.solicitante.codArea1 = codAreasPorCod("0" + telefono1[1]);
                            } else {
                                $scope.solicitante.codArea1 = codAreasPorCod(telefono1[1]);
                            }
                            $scope.solicitante.telefono1 = telefono1[2].substring(0,3)+"-"+telefono1[2].substring(3,7);
                        }
                    }
                    
                    if (telefono2) {
                        telefono2 = telefono2.match(numberRex);
                        if (telefono2) {
                            if (telefono2[1].length == 3) {
                                $scope.solicitante.codArea2 = codAreasPorCod("0" + telefono2[1]);
                            } else {
                                $scope.solicitante.codArea2 = codAreasPorCod(telefono2[1]);
                            }
                            $scope.solicitante.telefono2 = telefono2[2].substring(0,3)+"-"+telefono2[2].substring(3,7);
                            
                        }
                    }
                }
            });

        }]);

    cotizadorVehiculoControllers.controller('CotizadorVehiculoDatosVehiculoCtr', ['$scope', 'CotizadorVehiculoService', '$state', 'mensaje',
	    function($scope, CotizadorVehiculoService, $state, mensaje){
            $scope.$parent.ambienteActivo = 1;
            $scope.marcas = $scope.$parent.ambiente_vehiculo.marcas;
            $scope.modelos = $scope.$parent.ambiente_vehiculo.modelos;
            $scope.versiones = $scope.$parent.ambiente_vehiculo.versiones;
            $scope.vehiculo = $scope.$parent.vehiculo;

	        CotizadorVehiculoService.anio.execute(null,
	            function () {
		            return null;
		        }, 
                function (response) {
		            mensaje.errorRed('Cargando Años',response.status,true);
		        }).$promise.then(
                function (data) {
                    if (!$scope.$parent.ambiente_vehiculo.anios) {
                        $scope.$parent.ambiente_vehiculo.anios = [];
                        for (var i = data.anio_fin; i >= data.anio_ini; i--){
                            $scope.anios.push(i);
                            $scope.$parent.ambiente_vehiculo.anios.push(i);
                        }
                    $scope.modelos = [];
                    $scope.versiones = [];
                    } else {
                        $scope.anios = $scope.$parent.ambiente_vehiculo.anios;
                    }

                });

            $scope.buscarMarcas = function () {
                CotizadorVehiculoService.marca.execute({
                    'nanio': parseInt($scope.vehiculo.anio)
                }, function (data) {
                    $scope.marcas = data.marca_cur;
                    $scope.$parent.ambiente_vehiculo.marcas = data.marca_cur;
                    $scope.modelos = [];
                    $scope.$parent.ambiente_vehiculo.modelos = [];
                    $scope.versiones = [];
                    $scope.$parent.ambiente_vehiculo.versiones = [];
                    $scope.vehiculo.modelos = null;
                    $scope.vehiculo.versiones = null;
                }, function (response) {
		            mensaje.errorRed('Cargando Marcas de Vehículos',response.status,true);
		        });
            };

            $scope.buscarModelos = function () {
                CotizadorVehiculoService.modelo.execute({
                    'nanio': parseInt($scope.vehiculo.anio),
                    'ccodmarca': $scope.vehiculo.marca.valor
                }, function (data) {
                    $scope.modelos = data.modelo_cur;
                    $scope.$parent.ambiente_vehiculo.modelos = data.modelo_cur;
                    $scope.versiones = [];
                    $scope.$parent.ambiente_vehiculo.versiones = [];
                    $scope.vehiculo.versiones = null;

                }, function (response) {
		            mensaje.errorRed('Cargando Modelos de Vehículos',response.status,true);
		        });
            };

            $scope.buscarVersiones = function () {
                CotizadorVehiculoService.version.execute({
                    'nano': parseInt($scope.vehiculo.anio),
                    'ccodmarca': $scope.vehiculo.marca.valor,
                    'ccodmodelo': $scope.vehiculo.modelo.codmodelo
                }, function (data) {
                    $scope.versiones = data.version_cur;
                    $scope.$parent.ambiente_vehiculo.versiones = data.version_cur;
                }, function (response) {
		            mensaje.errorRed('Cargando Versiones de Vehículos',response.status,true);
		        });
            };

            $scope.aniosCeroKms = function () {
                var anios = $scope.anios.indexOf($scope.vehiculo.anio);
                if (anios >= 0 && anios <= 2) {
                    return true;
                } else {
                    return false;
                }
            };
        }]);

    cotizadorVehiculoControllers.controller('CotizadorVehiculoPlanesCtr', ['$scope', 'CotizadorVehiculoService', '$state', '$timeout', '$filter', 
	    'transform', 'mensaje', '$modal', function($scope, CotizadorVehiculoService, $state, $timeout, $filter, transform, mensaje, $modal) {
            $scope.$parent.ambienteActivo = 2;
            $scope.editSuma = false;
            $scope.descuento = 0;
            $scope.inicializar = function(){
                //Obtener planes
                $scope.clean();
                CotizadorVehiculoService.planes.execute(
                {
                    "nano" : $scope.vehiculo.anio,
                    "ccodmarca" : $scope.vehiculo.marca.valor,
                    "ccodmodelo" : $scope.vehiculo.modelo.codmodelo,
                    "ccodversion" : $scope.vehiculo.version.valor,
                    "ccodprod" : "3001",
                    "ncodinter" : null
                },
                function(listaPlanes){                
                    var error = 0;
                    for (var i = 0; i < listaPlanes.plan_cur.length; i++) {
                        if (listaPlanes.plan_cur[i].indrecomendada == "N") {
                            var indice = $scope.$parent.ambientePlan.planes.length;
                            $scope.$parent.ambientePlan.planes.push(listaPlanes.plan_cur[i]);
                            $scope.$parent.ambientePlan.planes[indice].indmodsuma = 'N';
                            $scope.obtenerCoberturasObligatorias(indice,$scope.obtenerCoberturasAdicionales);
                            $scope.$parent.ambientePlan.planes[indice].descuento = 0;
                            $scope.$parent.ambientePlan.planes[indice].coberturaSeleccionadas = [];
                            $scope.$parent.ambientePlan.planes[indice].indice = indice;
                            $scope.$parent.ambientePlan.planes[indice].mostrarEdicion = [];
                        } else {
                            $scope.$parent.ambientePlan.plan = listaPlanes.plan_cur[i];
                        }
                    }

                    $scope.$parent.ambientePlan.plan.idCobertAdicional = null,
                    $scope.$parent.ambientePlan.plan.idCobertObligatoria = null,
                    $scope.$parent.ambientePlan.plan.seleccion = Object();
                    $scope.$parent.ambientePlan.plan.coberturaSeleccionadas = [];
                    $scope.$parent.ambientePlan.plan.descuento = 0;
                    $scope.$parent.ambientePlan.plan.indmodsuma = 'N';
                    $scope.$parent.ambientePlan.plan.mostrarEdicion = [];
                    $scope.obtenerCoberturasObligatorias(undefined,$scope.obtenerCoberturasAdicionales);
                },
                function (response) {
                    mensaje.errorRed('Cargando Planes',response.status,true);
                });
            };
                
            $scope.clean = function() {
                $scope.$parent.descuento = 0;
                $scope.$parent.ambientePlan = Object();
                $scope.$parent.ambientePlan.errores = 0;
                $scope.$parent.ambientePlan.cargadas = 0;
                $scope.$parent.ambientePlan.cargado = 0;
                $scope.ambientePlan.mayorPrima = Object();
                $scope.ambientePlan.mayorPrima.primatotal = 0;
                $scope.$parent.ambientePlan.planes = [];
                $scope.$parent.ambientePlan.plan = Object();
                $scope.$parent.ambientePlan.planSeleccionado = Object();
            };

            $scope.tarificarCoberturasAdicionales = function(cobertura, remover){
                remover = typeof remover !== 'undefined' ? "N" : "S";
                CotizadorVehiculoService.tarificarCoberturasAdicionales.execute({
                    "ccodprod": $scope.ambientePlan.planSeleccionado.codprod,
                    "ccodplan": $scope.ambientePlan.planSeleccionado.codplan,
                    "crevplan": $scope.ambientePlan.planSeleccionado.revplan,
                    "ccodramo": cobertura.codramocert, 
                    "ccodcobert": cobertura.codcobert,
                    "nsumaasegcobertmod": cobertura.sumaasegmoneda, 
                    "nidcobadic": $scope.ambientePlan.planSeleccionado.idCobertAdicional,
                    "nidcobobli": $scope.ambientePlan.planSeleccionado.idCobertObligatoria,
                    "indinclusioncob": remover
                }, function (response) {
                    cobertura.primamoneda = parseFloat(response.cober_cur[0].mtoprimacobert);
                    $scope.ambientePlan.planSeleccionado.primatotal = parseFloat(response.cober_cur[0].mtoprimafinal);
                }, function (response) {
                    mensaje.errorRed('Cargando Coberturas Adicionales',response.status,true);
                });
            };

            $scope.obtenerCoberturasObligatorias = function(indice, coberturasAdicionales){
                var plan = typeof indice !== 'undefined' ?  $scope.ambientePlan.planes[indice] : $scope.ambientePlan.plan;
                var descuento = typeof indice !== 'undefined' ?  $scope.ambientePlan.planes[indice].descuento : $scope.descuento;
                CotizadorVehiculoService.cobertura.execute({
                    "ccodprod": plan.codprod,
                    "ccodplan": plan.codplan,
                    "crevplan": plan.revplan,
                    "nanoveh": $scope.vehiculo.anio,
                    "ccodmarca" : $scope.vehiculo.marca.valor,
                    "ccodmodelo" : $scope.vehiculo.modelo.codmodelo,
                    "ccodversion" : $scope.vehiculo.version.valor,
                    "ccodpais": "VNZ",
                    "ccodestado": $scope.solicitante.estado.codestado,
                    "ndescuento": parseInt(descuento) ? descuento : null,
                    "indmodsuma": plan.indmodsuma,
                    "c_coduusuario": 'BMRIVAS',
                    "nsumaaseg":  plan.sumaasegurada ? plan.sumaasegurada : null,
                    "idcobadic": plan.idCobertAdicional ? plan.idCobertAdicional : null
                },
                function(listacobertura){
                    var lista = [];
                    if (listacobertura.cober_cur != null) {
                        for(var i=0; i < listacobertura.cober_cur.length; i++){
                            var cobert = Object();
                            var item = listacobertura.cober_cur[i];
                            cobert.desccobert = item.desccobert;
                            cobert.primamoneda = parseFloat(item.primamoneda);
                            cobert.sumaasegmoneda = parseFloat(item.sumaasegmoneda);
                            cobert.codcobert = item.codcobert;
                            cobert.tasa = parseFloat(item.tasa);
                            cobert.codramocert = item.codramocert;
                            lista.push(cobert);
                        }
                    };
                    $scope.$parent.ambientePlan.cargadas = $scope.$parent.ambientePlan.cargadas + 1;
                    plan.coberturasObligatorias = lista;
                    plan.idCobertObligatoria = listacobertura.nidecobertobli;
                    plan.modprima = listacobertura.cmodprima == 'S' ?  true : false;
                    plan.primatotal = listacobertura.nprimatotal ? listacobertura.nprimatotal : 0;
                    plan.modsuma = listacobertura.cmodsuma == 'S' ? true : false;
                    plan.mostrarsuma = listacobertura.mostrarsumatotal== 'S' ? true : false;
                    plan.sumaasegurada = listacobertura.nsumaasegtotal;
                    $scope.$parent.coberturaPedida = true;
                    plan.minSumaAseg = listacobertura.nsumamin;
                    plan.maxSumaAseg = listacobertura.nsumamax;
                    plan.sumaAntigua = listacobertura.nsumaasegtotal;
                    plan.editSuma = false;
                    plan.error = listacobertura.cmensajeerror !== null ? listacobertura.cmensajeerror : false;
                    if (plan.error) {
                        $scope.$parent.ambientePlan.errores = $scope.$parent.ambientePlan.errores + 1;
                    }
                    if ($scope.$parent.ambientePlan.mayorPrima.primatotal < plan.primatotal) {
                        $scope.$parent.ambientePlan.mayorPrima = plan;
                        
                    }
                    if (($scope.ambientePlan.planes.length + 1) == $scope.ambientePlan.cargadas) {
                        if ($scope.ambientePlan.cargadas == $scope.ambientePlan.errores) {
                            mensaje.adver("Para el carro que esta intentando utilizar no podemos ofrecerle ningún plan. Lo sentimos. Puede comunicarse con el Área Técnica o el Área de Automóvil para informar acerca del error");
                            $scope.$parent.vehiculo.anio = undefined;
                            $scope.$parent.vehiculo.marca = undefined;
                            $scope.$parent.vehiculo.modelo = undefined;
                            $scope.$parent.vehiculo.version = undefined;
                            $scope.$parent.vehiculo.cerokm = undefined;
                            $(".previous").click();
                        }
                        $scope.$parent.ambientePlan.planSeleccionado = $scope.$parent.ambientePlan.mayorPrima;
                        $scope.$parent.ambientePlan.planAnterior = $scope.$parent.ambientePlan.mayorPrima;
                    }
                    
                    if (coberturasAdicionales !== undefined) {
                        coberturasAdicionales(indice);
                    }
                },
                function (response) {
                    mensaje.errorRed('Cargando Detalles de Planes y Coberturas Obligatorias',response.status,true);
                });
            };

            $scope.obtenerCoberturasAdicionales = function(indice){
                var plan = typeof indice !== 'undefined' ?  $scope.ambientePlan.planes[indice] : $scope.ambientePlan.plan;
                CotizadorVehiculoService.coberturasAdicionales.execute({
                    "ccodprod": plan.codprod,
                    "ccodplan": plan.codplan,
                    "crevplan": plan.revplan,
                    "nanoveh": $scope.vehiculo.anio,
                    "ccodmarca" : $scope.vehiculo.marca.valor,
                    "ccodmodelo" : $scope.vehiculo.modelo.codmodelo,
                    "ccodversion" : $scope.vehiculo.version.valor,
                    "ccodpais": "VNZ",
                    "ccodestado": $scope.solicitante.estado.codestado,
                    "ndescuento": null,
                    "indmodsuma": plan.indmodsuma,
                    "c_coduusuario": 'BMRIVAS',
                    "nsumaaseg":  plan.sumaasegurada ? plan.sumaasegurada : null,
                    "nindrecomendada": 'N',
                    "nidecobertobli": plan.idCobertObligatoria ? plan.idCobertObligatoria : null
                },
                function(response){
                    plan.coberturasAdicionales = response.cober_cur;
                    for (var i = 0; i < plan.coberturasAdicionales.length; i++) {
                        plan.coberturasAdicionales[i].codcompleto = plan.coberturasAdicionales[i].codramocert+plan.coberturasAdicionales[i].codcobert;
                    };
                    
                    plan.idCobertAdicional = response.nidecobertadic;
                },
                function(response){
                    mensaje.errorRed("Cargando Coberturas Adicionales", response.status, true);
                });
            };

            if (!$scope.coberturaPedida) {
                $scope.inicializar();
            } else {
                $scope.descuento = $scope.$parent.descuento;
            };

            $scope.seleccionarPlan = function(indice){
                $scope.$parent.ambientePlan.cargado = 1;
                var plan = Object();
                if (typeof indice === 'undefined') {
                    plan = $scope.$parent.ambientePlan.plan;        
                } else if (indice == - 1) {
                    if ($scope.$parent.ambientePlan.plan.error == false) {
                        plan = $scope.$parent.ambientePlan.planAnterior;
                    }
                } else {
                    plan = $scope.$parent.ambientePlan.planes[indice];
                };
                if (plan.error == false) {
                    if (($scope.ambientePlan.planSeleccionado.codplan != plan.codplan) || ($scope.ambientePlan.planSeleccionado.revplan != plan.revplan)) {
                        $scope.$parent.ambientePlan.planAnterior = $scope.$parent.ambientePlan.planSeleccionado;
                    };
                    $scope.$parent.ambientePlan.planSeleccionado = plan;
                }
            };

            $scope.enviarSuma = function(indice){
                var plan = typeof indice !== 'undefined' ?  $scope.ambientePlan.planes[indice] : $scope.ambientePlan.plan;
                var sum = plan.sumaasegurada;
                if(sum <= plan.maxSumaAseg && sum >= plan.minSumaAseg){
                    plan.editSuma = false;
                    plan.indmodsuma = 'S';
                    $scope.obtenerCoberturasObligatorias(indice,undefined);                    
                } else {
                    $scope.error = true;
                    $timeout(function(){
                        $scope.error = false;
                    }, 4000);
                }
            };

            $scope.noEnviarSuma = function(indice){
                var plan = typeof indice !== 'undefined' ?  $scope.$parent.ambientePlan.planes[indice] : $scope.$parent.ambientePlan.plan;
                plan.editSuma = false;
                plan.sumaasegurada = plan.sumaAntigua;
            };

            $scope.$watch('editSuma', function(value){
                if(value === true){
                    $timeout(function(){
                        slider(jQuery);
                        $scope.sumaAntigua = $scope.ambientePlan.plan.sumaasegurada;
                        $('#suma').focus();
                    }, 100);
                }
            });

            $scope.mostrarCoberturasAdicionales = function() {
                if($scope.ambientePlan.planSeleccionado.coberturasAdicionales && $scope.ambientePlan.planSeleccionado.coberturasAdicionales.length > 0){
                    var modalInstance = $modal.open({
                        templateUrl: 'views/cotizador/vehiculo/coberturas_adicionales.html',
                        controller: 'CotizadorVehiculoCoberturaAd',
                        backdrop: 'static',
                        scope: $scope
                    });
                }else{
                    mensaje.info("Este plan no posee coberturas adicionales");
                };
            };

            CotizadorVehiculoService.descuento.execute({
                "c_coduusuario": "BMRIVAS"
            }, function(data){
                $scope.maxDescuento = data.descuento;
                $timeout(function(){
                    slider(jQuery);
                },200);
            }, function (response) {
                mensaje.errorRed('Cargando Descuento Máximo del Usuario',response.status,true);
            });

            $scope.editarCobertura = function(index, edita, cobertura, plan){
                if(edita){
                    $scope.ambientePlan.planSeleccionado.mostrarEdicion[index] = true;
                    $timeout(function(){
                        $('#sumaaseg'+plan.codplan+plan.revplan+'_'+index).focus();
                    }, 100);
                }else{
                    if (parseInt(cobertura.sumaasegmoneda) > parseInt(cobertura.sumaasegmax) || parseInt(cobertura.sumaasegmoneda) < parseInt(cobertura.sumaasegmin)){
                        mensaje.adver("El monto ingresado esta fuera de los limites permitidos. Por lo que el mismo se ajustará al valor más conveniente en base a su elección.");
                        if (parseInt(cobertura.sumaasegmoneda) > parseInt(cobertura.sumaasegmax)) {
                            cobertura.sumaasegmoneda = cobertura.sumaasegmax;
                        } else {
                            cobertura.sumaasegmoneda = cobertura.sumaasegmin;
                        }
                    }else{
                        $scope.ambientePlan.planSeleccionado.mostrarEdicion[index] = false;
                        $scope.tarificarCoberturasAdicionales(cobertura);
                    }
                }
            };
    }]);

    cotizadorVehiculoControllers.controller('CotizadorVehiculoCoberturaAd', ['$scope', 'CotizadorVehiculoService', '$state', 'mensaje', '$modalInstance', '$timeout',
        function($scope, CotizadorVehiculoService, $state, mensaje, $modalInstance, $timeout){
            $scope.actualizarCoberturas = function(cobertura){
                $timeout(function(){
                    if($scope.ambientePlan.planSeleccionado.seleccion[cobertura.codcompleto]){
                        cobertura.sumaasegmoneda = parseFloat(cobertura.sumaasegmin);
                        $scope.tarificarCoberturasAdicionales(cobertura);
                        $scope.ambientePlan.planSeleccionado.coberturaSeleccionadas.push(cobertura);
                    }else{
                        var index = $scope.ambientePlan.planSeleccionado.coberturaSeleccionadas.indexOf(cobertura);
                        if(index > -1){
                            $scope.ambientePlan.planSeleccionado.coberturaSeleccionadas.splice(index,1);
                            $scope.tarificarCoberturasAdicionales(cobertura,true);
                        }
                    }
                }, 500);
            };

            $scope.ok = function(){
                $modalInstance.close();
                slider(jQuery);
            };
        }
    ]);

    cotizadorVehiculoControllers.controller('CotizadorVehiculoPagoCtr', ['$scope', 'CotizadorVehiculoService', '$state', 'mensaje',
	function($scope, CotizadorVehiculoService, $state, mensaje) {
            $scope.$parent.ambienteActivo = 3;
            
            var seleccionado = $scope.$parent.ambientePago.pagoSeleccionado ? true : false;
            if (!seleccionado) {
                CotizadorVehiculoService.financiamiento.execute(
                    {"p_prima": parseFloat($scope.$parent.ambientePlan.planSeleccionado.primatotal)} 
                    , function (data) {
                        $scope.$parent.ambientePago.pagos = data.c_planes_reg;
                        for (var i = 0; i < $scope.$parent.ambientePago.pagos.length; i++) {
                            if ($scope.$parent.ambientePago.pagos[i].tipoplan == 'C') {
                                $scope.$parent.ambientePago.pagoSeleccionado = $scope.ambientePago.pagos[i];
                            };
                        };
                    }, function (response) {
                        mensaje.errorRed('Cargando Financiamientos',response.status,true);
                    });
            }

            $scope.recalcularPago = function (pago) {
                CotizadorVehiculoService.pago.execute(
                    {
                    "p_cantgiros": pago.cantgiros,
                    "p_prima": $scope.ambientePlan.planSeleccionado.primatotal,
                    "p_porini": pago.porcinicial
                }, function (data) {
                    pago.mtogiro = parseFloat(data.c_plan[0].mtogirolocal);
                    pago.inicial_prima = parseFloat(data.c_plan[0].mtototinicial);
                }, function (response) {
                    mensaje.errorRed('Recalculando Pago',response.status,true);
                });
            };

            $scope.seleccionarPago = function (pago) {
                $scope.$parent.ambientePago.pagoSeleccionado = pago;
            };
        }]);

    cotizadorVehiculoControllers.controller('CotizadorVehiculoResumenCtr', ['$scope', 'CotizadorVehiculoService', '$state', 'mensaje',
	    function($scope, CotizadorVehiculoService, $state, mensaje){
            $scope.$parent.ambienteActivo = 4;
            $scope.solicitante = $scope.$parent.solicitante;
            $scope.vehiculo = $scope.$parent.vehiculo;
            $scope.numSolicitud = $scope.$parent.solicitante.numSolicitud; //TODO: esto no debería estar aquí...

            $scope.enviarCotizacion = function () {
                mensaje.enviarCotizacion($scope.numSolicitud,$scope.$parent.solicitante.nombre+" "+$scope.$parent.solicitante.apellidos);
            };
        }]);
});
