define(['angular'], function(angular) {
    'use strict';
    var cotizadorVehiculoControllers = angular.module('cotizadorVehiculoControllers', ['ngTable']);

    cotizadorVehiculoControllers.controller('CotizadorVehiculoMisCotizacionesCtr', ['$state', '$scope', 'CotizadorVehiculoService', 'ngTableParams', '$filter', 'mensaje', 'emitirCotizacion',
        function($state, $scope, CotizadorVehiculoService, ngTableParams, $filter, mensaje, emitirCotizacion) {
            $scope.estatuses = [{
                    'val': '',
                    'descrip': 'Todos los Estatus'
                },
                {
                    'val': 'VAL',
                    'descrip': 'Válidas'
                },
                {
                    'val': 'EMI',
                    'descrip': 'Emitidas'
                }
                //{ 'val': 'ANU',
                //'descrip' : 'Vencidas' }
            ];

            $scope.datosFiltro = {
                'solicitante': "",
                'nrosolic': "",
                'estatus': $scope.estatuses[1]
            };

            $scope.cargado = 0;
            CotizadorVehiculoService.usuarioActual.execute({}, function(data) {
                $scope.usuario = data;
            }, function(response) {
                mensaje.errorRed('Cargando Usuario', response.status);
            });
            $scope.cargado = 1;
            CotizadorVehiculoService.misCotizaciones.execute({
                "i_CodUsr": "BMRIVAS"
            }, function(data) {
                $scope.cargado = 2;
                $scope.cotizaciones = data.cotizaciones_cur;
                jQuery.map($scope.cotizaciones, function(cotizacion, i) {
                    $scope.cotizaciones[i].nrosolic = parseInt(cotizacion.nrosolic);
                    $scope.cotizaciones[i].prima = parseFloat(cotizacion.prima);
                    var nombre = $scope.cotizaciones[i].nombre == undefined ? "" : ($scope.cotizaciones[i].nombre.split(" "))[0];
                    var apellido = $scope.cotizaciones[i].apellido == undefined ? "" : ($scope.cotizaciones[i].apellido.split(" "))[0];
                    $scope.cotizaciones[i].solicitante = nombre + " " + apellido;

                });
                $scope.cargado = 3;
                $scope.tableParams = new ngTableParams({
                    page: 1,
                    count: 10,
                    sorting: {
                        nrosolic: 'desc'
                    },
                    filter: {
                        stssolic: 'VAL'
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
            }, function(response) {
                mensaje.errorRed('Cargando Cotizaciones', response.status);
            });



            $scope.mostrarEmpleado = function() {
                var mostrar = $scope.usuario ? $.inArray("EMPLEADO", $scope.usuario.roles) : -1;
                return mostrar;
            };
            $scope.mostrarEmisor = function() {
                var mostrar = $scope.usuario ? $.inArray("EMISOR", $scope.usuario.roles) : -1;
                return mostrar;
            };

            $scope.filtrar2 = function() {
                $scope.tableParams.filter({ 'nombre': $scope.datosFiltro.solicitante, 'stssolic': $scope.datosFiltro.estatus.val });
            };
            $scope.filtrar = function() {
                $scope.tableParams.filter({ 'nrosolic': $scope.datosFiltro.nrosolic, 'stssolic': $scope.datosFiltro.estatus.val });
            };

            $scope.filtrarEstatus = function(estatus) {
                $scope.datosFiltro.estatus = estatus;
                //$scope.tableParams.filter({'stssolic': $scope.datosFiltro.estatus.val});
                $scope.filtrar();
                //$scope.filtrar2();
            };

            //  $scope.filtrar = function () {
            //  $scope.tableParams.filter({'stssolic': $scope.datosFiltro.estatus.val});
            //   $scope.filtrar();
            // };

            $scope.emitir = function(nrosolic) {
                $scope.poliza = emitirCotizacion;
                $scope.poliza.nro = nrosolic;
                $scope.poliza.ambiente = 1;
                $state.go('emisionvehiculo');
            };

            $scope.editarcotizar = function(nrosolic) {
                $scope.cotizacion = editarCotizacion;
                $scope.cotizacion.nrosolic = nrosolic;
                $scope.cotizacion.editar1 = 'S';
                $scope.cotizacion.ambienteActivo = 0;
                $state.go('cotizadorvehiculo');
            };

            //  $scope.enviarCotizacion = function (nrosolic) {
            //    mensaje.enviarCotizacion($scope.cotizaciones.nrosolic,$scope.cotizaciones.solicitante);
            //};


            $scope.enviarCotizacion = function(nrosolic) {
                for (var i = 0; i < $scope.cotizaciones.length; i++) {
                    if ($scope.cotizaciones[i].nrosolic == nrosolic) {
                        mensaje.enviarCotizacion($scope.cotizaciones[i].nrosolic, $scope.cotizaciones[i].solicitante);
                        //console.log(nrosolic);
                        //console.log(solicitante);
                        break;
                    };
                };
            };
        }
    ]);

    cotizadorVehiculoControllers.controller('CotizadorVehiculoTodasCotizacionesCtr', ['$state', '$scope', 'EmisionVehiculoService', 'CotizadorVehiculoService', 'ngTableParams', '$filter', 'mensaje', 'emitirCotizacion',
        function($state, $scope, EmisionVehiculoService, CotizadorVehiculoService, ngTableParams, $filter, mensaje, emitirCotizacion) {
            $scope.estatuses = [{
                    'val': '',
                    'descrip': 'Todos los Estatus'
                },
                {
                    'val': 'VAL',
                    'descrip': 'Válidas'
                },
                {
                    'val': 'EMI',
                    'descrip': 'Emitidas'
                }
                //{ 'val': 'ANU',
                //'descrip' : 'Vencidas' }
            ];

            $scope.datosFiltro = {
                'nrosolic': "",
                'intermediario': "",
                'estatus': $scope.estatuses[1]
            };
            $scope.cargado = 0;
            CotizadorVehiculoService.todasCotizaciones.execute({
                "i_CodUsr": "BMRIVAS"
            }, function(data) {
                $scope.cargado = 1;
                $scope.cotizaciones = data.cotizaciones_cur;
                CotizadorVehiculoService.estado.execute(null,
                    function(data) {
                        $scope.cargado = 2;
                        $scope.estados = data.estado_cur;
                        jQuery.map($scope.cotizaciones, function(cotizacion, i) {
                            $scope.cotizaciones[i].nrosolic = parseInt(cotizacion.nrosolic);
                            $scope.cotizaciones[i].prima = parseFloat(cotizacion.prima);
                            var nombre = $scope.cotizaciones[i].nombre == undefined ? "" : ($scope.cotizaciones[i].nombre.split(" "))[0];
                            var apellido = $scope.cotizaciones[i].apellido == undefined ? "" : ($scope.cotizaciones[i].apellido.split(" "))[0];
                            $scope.cotizaciones[i].solicitante = nombre + " " + apellido;
                            $scope.cotizaciones[i].estado = (estadoPorID(cotizacion.codestado)).descestado;
                        });
                        $scope.cargado = 3;
                        $scope.tableParams = new ngTableParams({
                            page: 1,
                            count: 10,
                            sorting: {
                                nrosolic: 'desc'
                            },
                            filter: {
                                stssolic: 'VAL'
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
                        $scope.cargado = 4;
                    },
                    function(response) {
                        mensaje.errorRed('Estados', response.status, true);
                    });
            }, function(response) {
                mensaje.errorRed('Cargando Cotizaciones', response.status);
            });

            CotizadorVehiculoService.usuarioActual.execute({}, function(data) {
                $scope.usuario = data;
            }, function(response) {
                mensaje.errorRed('Cargando Usuario', response.status);
            });
            $scope.mostrarEmisor = function() {
                var mostrar = $scope.usuario ? $.inArray("EMISOR", $scope.usuario.roles) : -1;
                return mostrar;
            };
            $scope.emitir = function(nrosolic) {
                $scope.poliza = emitirCotizacion;
                $scope.poliza.nro = nrosolic;
                $scope.poliza.ambiente = 2;
                $state.go('emisionvehiculo');
            };

            $scope.editarcotizar = function(nrosolic) {
                $scope.cotizacion = editarCotizacion;
                $scope.cotizacion.nrosolic = nrosolic;
                $scope.cotizacion.editar1 = 'S';
                $scope.cotizacion.ambienteActivo = 0;
                $state.go('cotizadorvehiculo');
            };

            $scope.enviarCotizacion = function(nrosolic) {
                for (var i = 0; i < $scope.cotizaciones.length; i++) {
                    if ($scope.cotizaciones[i].nrosolic == nrosolic) {
                        mensaje.enviarCotizacion($scope.cotizaciones[i].nrosolic, $scope.cotizaciones[i].solicitante);
                        break;
                    };
                };
            };

            $scope.filtrar2 = function() {
                $scope.tableParams.filter({ 'nrosolic': $scope.datosFiltro.nrosolic, 'stssolic': $scope.datosFiltro.estatus.val });
            };

            $scope.filtrar = function() {
                $scope.tableParams.filter({ 'codinter': $scope.datosFiltro.intermediario, 'stssolic': $scope.datosFiltro.estatus.val });
            };

            $scope.filtrarEstatus = function(estatus) {
                $scope.datosFiltro.estatus = estatus;
                $scope.filtrar();
                $scope.filtrar2();
            };
            /*
                    $scope.descargarEmision = function (nnumcertificado,nidobjeto){
                            EmisionVehiculoService.cuadroPoliza.execute({
                            "nidobjeto":nidobjeto,
                            "nnumcertificado":nnumcertificado,
                            "ctipoobjeto":"POL"
                    }, function(data) {
                        $window.open(data.result,'_blank');
                    });
                    };


            */

            function estadoPorID(id) {
                for (var estado = 0; estado < $scope.estados.length; estado++) {
                    if ($scope.estados[estado].codestado == id) {
                        return $scope.estados[estado];
                    }
                }
            };

        }
    ]);

    cotizadorVehiculoControllers.controller('CotizadorVehiculoCtr', ['$scope', 'CotizadorVehiculoService', '$state', '$modal', 'mensaje', 'Idle', 'editarCotizacion',
        function($scope, CotizadorVehiculoService, $state, $modal, mensaje, Idle, editarCotizacion) {


            $scope.cotizacion = editarCotizacion;
            //$scope.cotizacion.nrosolic = nrosolic;
            //$state.go('cotizadorvehiculo');

            $scope.editar ? $scope.cotizacion.editar1 : 'N';
            //console.log($scope.cotizacion.nrosolic);
            //console.log($scope.$parent.editar1);
            //console.log($scope.cotizacion.editar1)
            if ($scope.cotizacion.editar1 != 'S') {


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
                $scope.coberturaPedida = false;
                $scope.ambientePlan = Object();
                $scope.ambientePlan.errores = 0;
                $scope.ambientePlan.cargadas = 0;
                $scope.ambientePlan.cargado = 0;
                $scope.ambientePlan.mayorPrima = Object();
                $scope.ambientePago = Object();
                $scope.ambientePago.pagoSeleccionado = undefined;
                $scope.ambienteActivo = 0;

                $scope.intermediarios = [];
                $scope.intermediario = {};

                CotizadorVehiculoService.usuarioActual.execute({}, function(data) {
                    $scope.usuario = data;
                    $scope.intermediario.codinter = data.codInter;
                    $scope.numSolicitud = data.rosolic;

                    if ($scope.mostrarEmpleado() >= 0) {
                        CotizadorVehiculoService.intermediarios.execute({}, function(data) {
                            $scope.intermediarios = data.devuelve_intermediarios;
                            jQuery.map($scope.intermediarios, function(intermediario, i) {
                                $scope.intermediarios[i].nombre = intermediario.nombre + " (" + intermediario.codinter + ")"
                            });
                            $scope.intermediario = $scope.obtenerIntermediarioss();
                        }, function(response) {
                            mensaje.errorRed('Cargando Usuario', response.status);
                        });
                    };

                }, function(response) {
                    mensaje.errorRed('Cargando Usuario', response.status);
                });

                $scope.mostrarEmpleado = function() {
                    var mostrar = $scope.usuario ? $.inArray("EMPLEADO", $scope.usuario.roles) : -1;
                    return mostrar;
                };
                $scope.mostrarEmisor = function() {
                    var mostrar = $scope.usuario ? $.inArray("EMISOR", $scope.usuario.roles) : -1;
                    return mostrar;
                };
                $scope.obtenerIntermediarioss = function() {
                    for (var i = 0; i < $scope.intermediarios.length; i++) {
                        if ($scope.intermediarios[i].codinter == $scope.intermediario.codinter) {
                            return $scope.intermediarios[i];
                        }
                    }
                };


                var $w1finish = $('#w1').find('ul.pager li.finish'),
                    $w1validator = $("#w1 form").validate({
                        highlight: function(element) {
                            $(element).closest('.form-group').removeClass('has-success').addClass('has-error');
                        },
                        success: function(element) {
                            $(element).closest('.form-group').removeClass('has-error');
                            $(element).remove();
                        },
                        errorPlacement: function(error, element) {
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
                            sexo: true,
                            codArea2: {
                                required: function(element) {
                                    var result = false;
                                    if ($scope.solicitante.telefono2) {
                                        if ($scope.solicitante.telefono2.length > 0) {
                                            result = true;
                                        }
                                    };
                                    return result;
                                }
                            },
                            telefono2: {
                                required: function(element) {
                                    var result = false;
                                    if ($scope.solicitante.codArea2 != undefined) {
                                        result = true;
                                    }
                                    return result;
                                }
                            }
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
                            solicitanteTipoId: "Seleccione Cédula o Rif",
                            nacimiento: "Por favor introduzca su fecha de nacimiento",
                            estado: "Seleccione un estado",
                            codArea1: "Por favor introduzca el código del número de teléfono",
                            telefono1: "Por favor introduzca el número de teléfono"
                        }
                    });

                $w1finish.on('click', function(ev) {
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
                    onPrevious: function(tab, navigation, index) {
                        var states = {
                            0: "cotizadorvehiculo.solicitante",
                            1: "cotizadorvehiculo.vehiculo",
                            2: "cotizadorvehiculo.planes",
                            3: "cotizadorvehiculo.pago",
                            4: "cotizadorvehiculo.resumen"
                        };
                        $state.go(states[index]);
                    },
                    onNext: function(tab, navigation, index, newindex) {
                        var validated = $('#w1 form').valid();
                        if (!validated) {
                            $w1validator.focusInvalid();
                            return false;
                        }
                        switch (index) {
                            case 1:
                                CotizadorVehiculoService.cotizacionSolicitante.execute({
                                    'io_nrosolic': $scope.numSolicitud,
                                    'i_tipoid': $scope.solicitante.tipoId.substring(0, 1),
                                    'i_numid': $scope.solicitante.numId,
                                    'i_nombre': $scope.solicitante.nombre,
                                    'i_apellido': $scope.solicitante.apellidos,
                                    'i_fecnac': $scope.solicitante.fechaNacimiento,
                                    'i_sexo': $scope.solicitante.sexo ? $scope.solicitante.sexo.substring(0, 1) : null,
                                    'i_edocivil': $scope.solicitante.edocivil,
                                    'i_codestado': $scope.solicitante.estado.codestado,
                                    'i_codciudad': $scope.solicitante.codciudad ? $scope.solicitante.codciudad : null,
                                    'i_codmunicipio': $scope.solicitante.codmunicipio ? $scope.solicitante.codmunicipio : null,
                                    'i_codurbanizacion': $scope.solicitante.codurbanizacion ? $scope.solicitante.codurbanizacion : null,
                                    'i_direccion': $scope.solicitante.direccion,
                                    'i_email': $scope.solicitante.email,
                                    'i_profesion': $scope.solicitante.profesion,
                                    'i_telefono1': $scope.solicitante.codArea1.codtelefono + $scope.solicitante.telefono1.substring(0, 3) + $scope.solicitante.telefono1.substring(4, 8),
                                    'i_telefono2': ($scope.solicitante.telefono2 && $scope.solicitante.telefono2.length > 0 && $scope.solicitante.codArea2) ? $scope.solicitante.codArea2.codtelefono + $scope.solicitante.telefono2.substring(0, 3) + $scope.solicitante.telefono2.substring(4, 8) : null,
                                    'i_codinter': $scope.intermediario.codinter
                                }, function(data) {
                                    $scope.numSolicitud = data.io_nrosolic;
                                    $scope.solicitante.numSolicitud = data.io_nrosolic; //TODO: Se debe mejorar esto. Solución temporal
                                }, function(response) {
                                    mensaje.errorRed('Guardando Persona', response.status, true);
                                });
                                $state.go('cotizadorvehiculo.vehiculo');
                                break;
                            case 2:
                                CotizadorVehiculoService.cotizacionVehiculo.execute({
                                    'io_nrosolic': $scope.solicitante.numSolicitud, //TODO: esto no debería estar aquí...
                                    'i_codmarca': $scope.vehiculo.marca.valor,
                                    'i_codmodelo': $scope.vehiculo.modelo.codmodelo,
                                    'i_codversion': $scope.vehiculo.version.valor,
                                    'i_anoveh': $scope.vehiculo.anio,
                                    'i_indcerokm': $scope.vehiculo.cerokm ? "S" : "N"
                                }, function(data) {
                                    $scope.numSolicitud = data.io_nrosolic;
                                }, function(response) {
                                    mensaje.errorRed('Guardando Vehículo', response.status, true);
                                });
                                $state.go('cotizadorvehiculo.planes');
                                break;
                            case 3:
                                //console.log($scope.ambientePlan.planSeleccionado);
                                //console.log($scope.ambientePlan.planSeleccionado.coberturasObligatorias)
                                //console.log(cobertura);
                                //console.log($scope.ambientePlan.planSeleccionado.coberturasObligatorias.mtodeduciblesin);
                                //console.log($scope.ambientePlan.planSeleccionado.coberturasObligatorias.porcdeduciblesin);
                                //$scope.ambientePlan.planSeleccionado.coberturaSeleccionadas.push(cobertura);
                                CotizadorVehiculoService.cotizacionCobertura.execute({
                                    'i_nrosolic': $scope.solicitante.numSolicitud, //TODO: esto no debería estar aquí...
                                    "i_codprod": $scope.ambientePlan.planSeleccionado.codprod,
                                    "i_id_cob_obligatoria": $scope.ambientePlan.planSeleccionado.idCobertObligatoria,
                                    "i_id_cob_adicional": $scope.ambientePlan.planSeleccionado.idCobertAdicional
                                        //"i_mtodeduciblesin" : $scope.ambientePlan.planSeleccionado.coberturasObligatorias.mtodeduciblesin,//$scope.$parent.mtodeduciblesin ? $scope.$parent.mtodeduciblesin : 0 ,
                                        //"i_porcdeduciblesin" : $scope.ambientePlan.planSeleccionado.coberturasObligatorias.porcdeduciblesin//$scope.$parent.porcdeduciblesin ? $scope.$parent.porcdeduciblesin :0
                                }, function(data) {
                                    $scope.ambientePago.pagos = [{}];
                                    $scope.ambientePago.pagos[0].cantgiros = 0;
                                    $scope.ambientePago.pagos[0].porcinicial = 100;
                                    $scope.ambientePago.pagos[0].tipoplan = "C";
                                    $scope.ambientePago.pagos[0].nomplan = "Contado";
                                    $scope.ambientePago.pagos[0].inicial_prima = $scope.ambientePlan.planSeleccionado.primatotal;
                                    $scope.ambientePago.pagos[0].mtogiro = parseFloat(0);

                                    CotizadorVehiculoService.financiamientoPlanes.execute({
                                        'ncotizacion': $scope.solicitante.numSolicitud,
                                        'ccodplan': $scope.ambientePlan.planSeleccionado.codplan,
                                        'crevplan': $scope.ambientePlan.planSeleccionado.revplan,
                                        'nmtoprima': parseFloat($scope.ambientePlan.planSeleccionado.primatotal)
                                    }, function(data) {
                                        if (data.cmensaje == null) {
                                            $scope.ambientePago.pagos.push({});
                                            $scope.ambientePago.pagos[1].giros = [];
                                            for (var i = parseInt(data.ncantgirosmin); i <= parseInt(data.ncantgirosmax); i++) {
                                                $scope.ambientePago.pagos[1].giros.push(i);
                                            }
                                            $scope.ambientePago.pagos[1].cantgiros = parseInt(data.ncantgirosmax);
                                            $scope.ambientePago.pagos[1].cantgirosmax = parseInt(data.ncantgirosmax);
                                            $scope.ambientePago.pagos[1].cantgirosmin = parseInt(data.ncantgirosmin);
                                            $scope.ambientePago.pagos[1].porcinicial = parseInt(data.nporcinicialmin);
                                            $scope.ambientePago.pagos[1].porcinicialmax = parseInt(data.nporcinicialmax);
                                            $scope.ambientePago.pagos[1].porcinicialmin = parseInt(data.nporcinicialmin);
                                            $scope.ambientePago.pagos[1].tipoplan = "F";
                                            $scope.ambientePago.pagos[1].nomplan = "Financiado";

                                            CotizadorVehiculoService.calculoFinanciamiento.execute({
                                                //CotizadorVehiculoService.financiamientoCalculo.execute({
                                                'ncotizacion': $scope.solicitante.numSolicitud,
                                                'ccodplan': $scope.ambientePlan.planSeleccionado.codplan,
                                                'crevplan': $scope.ambientePlan.planSeleccionado.revplan,
                                                'nmtoprima': parseFloat($scope.ambientePlan.planSeleccionado.primatotal),
                                                'nporcinicial': parseInt(data.nporcinicialmin),
                                                'ncantgiros': parseInt(data.ncantgirosmax),
                                                'nmtoinicial': parseInt(data.nmtoinicial),
                                                //'nporcinicial' : parseInt(data.nporcinicial)
                                            }, function(data) {
                                                $scope.ambientePago.pagos[1].mtogiro = parseFloat(data.nmtogiro);
                                                $scope.ambientePago.pagos[1].inicial_prima = parseFloat(data.nmtoinicial);
                                                $scope.ambientePago.pagos[1].mtoprestamo = parseFloat(data.nmtoprestamo);
                                                $scope.ambientePago.pagos[1].montoinicial = parseFloat(data.nmtoinicial);
                                                //$scope.ambientePago.pagos[1].porcinicial = parseFloat(data.nporcinicial);

                                            }, function(response) {
                                                mensaje.errorRed('Cargando Financiamientos', response.status, true);
                                            });
                                            $scope.ambientePago.error = undefined;
                                        } else {
                                            $scope.ambientePago.error = data.cmensaje;
                                        }
                                        $scope.ambientePago.pagoSeleccionado = $scope.ambientePago.pagos[0];
                                    }, function(response) {
                                        mensaje.errorRed('Cargando Pagos', response.status, true);
                                    });

                                }, function(response) {
                                    mensaje.errorRed('Guardando Coberturas Seleccionadas', response.status, true);
                                });
                                $state.go('cotizadorvehiculo.pago');
                                break;
                            case 4:
                                CotizadorVehiculoService.guardarFinanciamiento.execute({
                                    'i_nrosolic': $scope.solicitante.numSolicitud, //TODO: esto no debería estar aquí...
                                    'i_codplan': $scope.ambientePago.pagoSeleccionado.ideplan,
                                    'i_modplan': $scope.ambientePago.pagoSeleccionado.ideplan,
                                    'i_porcinicial': parseFloat($scope.ambientePago.pagoSeleccionado.porcinicial) ? parseFloat($scope.ambientePago.pagoSeleccionado.porcinicial) : 0,
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
                    onTabClick: function(tab, navigation, index, newindex) {
                        var states = {
                            0: "cotizadorvehiculo.solicitante",
                            1: "cotizadorvehiculo.vehiculo",
                            2: "cotizadorvehiculo.planes",
                            3: "cotizadorvehiculo.pago",
                            4: "cotizadorvehiculo.resumen"
                        };
                        if (newindex == index + 1) {
                            return this.onNext(tab, navigation, index + 1, newindex);
                        } else if (newindex > index + 1) {
                            return false;
                        } else {
                            $state.go(states[newindex]);
                        }
                    },
                    onTabChange: function(tab, navigation, index, newindex) {
                        var totalTabs = navigation.find('li').size() - 1;
                        $w1finish[newindex != totalTabs ? 'addClass' : 'removeClass']('hidden');
                        $('#w1').find(this.nextSelector)[newindex == totalTabs ? 'addClass' : 'removeClass']('hidden');
                    }
                });

                $scope.closeModals = function() {
                    if ($scope.warning) {
                        $scope.warning.close();
                        $scope.warning = null;
                    }


                }

                var finalizar = function() {

                    var modalInstance = $modal.open({
                        templateUrl: 'views/cotizador/vehiculo/finalizar_cotizacion.html',
                        controller: 'CotizadorVehiculoFinalizar',
                        backdrop: 'static',
                        keyboard: false,
                        scope: $scope
                    });
                    $scope.closeModals();
                };

                $state.go('cotizadorvehiculo.solicitante');
            } else {




            }
        }
    ]);

    cotizadorVehiculoControllers.controller('CotizadorVehiculoFinalizar', ['$scope', '$state', 'CotizadorVehiculoService', '$modalInstance', '$timeout', 'emitirCotizacion', 'mensaje',
        function($scope, $state, CotizadorVehiculoService, $modalInstance, $timeout, emitirCotizacion, mensaje) {


            $scope.emitir = function() {
                $scope.poliza = emitirCotizacion;
                $scope.poliza.nro = $scope.solicitante.numSolicitud;
                $scope.poliza.ambiente = $scope.intermediario.codinter != $scope.usuario.codInter ? 2 : 1;
                $modalInstance.close(true);
                $state.go('emisionvehiculo');
            };


            $scope.nuevaPoliza = function() {
                $modalInstance.close(true);
                $state.transitionTo('cotizadorvehiculo', null, {
                    reload: true,
                    inherit: false,
                    notify: true
                });
            };

            $scope.inicio = function() {
                $modalInstance.close(true);
                $state.go('home');
            };

            $scope.cancel = function() {
                $modalInstance.dismiss('cancel');
                mensaje.adver("Sera enviado aútomaticamente a inicio");
            };

            // $scope.cerrar = function(){
            //  $modalInstance.close();
            //  mensaje.adver("Sera enviado aútomaticamente a inicio");
            // };

            $scope.$parent.ambienteActivo = 4;
            $scope.solicitante = $scope.solicitante;
            $scope.vehiculo = $scope.vehiculo;
            $scope.numSolicitud = $scope.solicitante.numSolicitud; //TODO: esto no debería estar aquí...

            $scope.enviarCotizacion = function() {
                mensaje.enviarCotizacion($scope.numSolicitud, $scope.solicitante.nombre + " " + $scope.solicitante.apellidos);
            };
        }
    ]);

    cotizadorVehiculoControllers.controller('CotizadorVehiculoSolicitanteCtr', ['$scope', 'CotizadorVehiculoService', 'mensaje',
        function($scope, CotizadorVehiculoService, mensaje) {
            $scope.$parent.ambienteActivo = 0;
            if (!$scope.$parent.ambiente_solicitante.estados) {
                CotizadorVehiculoService.estado.execute(null,
                    function(data) {
                        $scope.estados = data.estado_cur;
                        $scope.$parent.ambiente_solicitante.estados = data.estado_cur;
                        $scope.initEstados = 1;
                    },
                    function(response) {
                        mensaje.errorRed('Cargando Estados', response.status, true);
                    });
            } else {
                $scope.estados = $scope.$parent.ambiente_solicitante.estados;
                $scope.codAreas = $scope.$parent.ambiente_solicitante.codAreas;
            };

            $scope.solicitante = $scope.$parent.solicitante;
            $scope.telefonos = [0, 0];
            $('#date').mask("99/99/9999");
            $('.phone').mask("999-9999");

            if ($scope.solicitante.numId) {
                if ($scope.solicitante.exists) {
                    $scope.userexists = true;
                }
                $scope.telefonos[0] = $scope.solicitante.codArea1.codtelefono + $scope.solicitante.telefono1;
                $scope.telefonos[0] = ($scope.telefonos[0]).substring(1, 11);

                if ($scope.solicitante.codArea2 != undefined || $scope.solicitante.telefono2.length > 0) {
                    $scope.telefonos[1] = $scope.solicitante.codArea2.codtelefono + $scope.solicitante.telefono2;
                    $scope.telefonos[1] = $scope.telefonos[1].substring(1, 11);
                }
            }

            function sexoPorInicial(inicial) {
                for (var i = 0; i < $scope.$parent.sexos.length; i++) {
                    if ($scope.$parent.sexos[i].substring(0, 1) == inicial) {
                        return $scope.$parent.sexos[i];
                    }
                }
            };

            $scope.buscarAsegurado = function() {
                CotizadorVehiculoService.tercero.execute({
                    'p_tipoid': $scope.solicitante.tipoId.substring(0, 1),
                    'p_numid': parseInt($scope.solicitante.numId),
                    'p_dvid': '0'
                }, function(data) {
                    return null;
                }, function(response) {
                    mensaje.errorRed('Cargando Personas', response.status, true);
                }).$promise.then(
                    function(asegurado) {
                        if (asegurado.c_solicitante.length) {
                            $scope.userexists = true;
                            $scope.solicitante.exists = true;
                            $scope.solicitante.nombre = asegurado.c_solicitante[0].nomter;
                            $scope.solicitante.apellidos = asegurado.c_solicitante[0].apeter;
                            $scope.solicitante.fechaNacimiento = asegurado.c_solicitante[0].fecnac;
                            $scope.solicitante.sexo = sexoPorInicial(asegurado.c_solicitante[0].sexo);
                            $scope.solicitante.edocivil = asegurado.c_solicitante[0].edocivil;
                            $scope.solicitante.estado = estadoPorID(asegurado.c_solicitante[0].codestado, $scope);
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


            $scope.clicked = function() {
                $('[data-provide=datepicker]').focus();
            };

            $scope.limpiarFormulario = function() {
                if ($scope.userexists) {
                    $scope.iniciarFormulario();
                }
            };

            $scope.iniciarFormulario = function() {
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
                $scope.telefonos = [0, 0];
            };

            $scope.buscarCodAreas = function() {
                CotizadorVehiculoService.codArea.execute({
                        'c_codestado': $scope.solicitante.estado.codestado
                    },
                    function() {
                        return null;
                    },
                    function(response) {
                        mensaje.errorRed('Cargando Códigos de Áreas', response.status, true);
                    }).$promise.then(
                    function(data) {
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

            $scope.$watch('initEstados', function() {
                if ($scope.initEstados == 1) {
                    $scope.initEstados = 2;
                    if ($scope.solicitante.estado) {
                        $scope.solicitante.estado = estadoPorID($scope.solicitante.estado.codestado, $scope);
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
                            $scope.solicitante.telefono1 = telefono1[2].substring(0, 3) + "-" + telefono1[2].substring(3, 7);
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
                            $scope.solicitante.telefono2 = telefono2[2].substring(0, 3) + "-" + telefono2[2].substring(3, 7);

                        }
                    }
                }
            });

        }
    ]);

    cotizadorVehiculoControllers.controller('CotizadorVehiculoDatosVehiculoCtr', ['$scope', 'CotizadorVehiculoService', '$state', 'mensaje',
        function($scope, CotizadorVehiculoService, $state, mensaje) {
            $scope.$parent.ambienteActivo = 1;
            $scope.marcas = $scope.$parent.ambiente_vehiculo.marcas;
            $scope.modelos = $scope.$parent.ambiente_vehiculo.modelos;
            $scope.versiones = $scope.$parent.ambiente_vehiculo.versiones;
            $scope.vehiculo = $scope.$parent.vehiculo;

            CotizadorVehiculoService.anio.execute(null,
                function() {
                    return null;
                },
                function(response) {
                    mensaje.errorRed('Cargando Años', response.status, true);
                }).$promise.then(
                function(data) {
                    if (!$scope.$parent.ambiente_vehiculo.anios) {
                        $scope.$parent.ambiente_vehiculo.anios = [];
                        for (var i = data.anio_fin; i >= data.anio_ini; i--) {
                            $scope.anios.push(i);
                            $scope.$parent.ambiente_vehiculo.anios.push(i);
                        }
                        $scope.modelos = [];
                        $scope.versiones = [];
                    } else {
                        $scope.anios = $scope.$parent.ambiente_vehiculo.anios;
                    }

                });

            $scope.buscarMarcas = function() {
                CotizadorVehiculoService.marca.execute({
                    'nanio': parseInt($scope.vehiculo.anio)
                }, function(data) {
                    $scope.marcas = data.marca_cur;
                    $scope.$parent.ambiente_vehiculo.marcas = data.marca_cur;
                    $scope.modelos = [];
                    $scope.$parent.ambiente_vehiculo.modelos = [];
                    $scope.versiones = [];
                    $scope.$parent.ambiente_vehiculo.versiones = [];
                    $scope.vehiculo.modelos = null;
                    $scope.vehiculo.versiones = null;
                }, function(response) {
                    mensaje.errorRed('Cargando Marcas de Vehículos', response.status, true);
                });
            };

            $scope.buscarModelos = function() {
                CotizadorVehiculoService.modelo.execute({
                    'nanio': parseInt($scope.vehiculo.anio),
                    'ccodmarca': $scope.vehiculo.marca.valor
                }, function(data) {
                    $scope.modelos = data.modelo_cur;
                    $scope.$parent.ambiente_vehiculo.modelos = data.modelo_cur;
                    $scope.versiones = [];
                    $scope.$parent.ambiente_vehiculo.versiones = [];
                    $scope.vehiculo.versiones = null;

                }, function(response) {
                    mensaje.errorRed('Cargando Modelos de Vehículos', response.status, true);
                });
            };

            $scope.buscarVersiones = function() {
                CotizadorVehiculoService.version.execute({
                    'nano': parseInt($scope.vehiculo.anio),
                    'ccodmarca': $scope.vehiculo.marca.valor,
                    'ccodmodelo': $scope.vehiculo.modelo.codmodelo
                }, function(data) {
                    $scope.versiones = data.version_cur;
                    $scope.$parent.ambiente_vehiculo.versiones = data.version_cur;
                }, function(response) {
                    mensaje.errorRed('Cargando Versiones de Vehículos', response.status, true);
                });
            };

            $scope.aniosCeroKms = function() {
                var anios = $scope.anios.indexOf($scope.vehiculo.anio);
                if (anios >= 0 && anios <= 2) {
                    return true;
                } else {
                    return false;
                }
            };
        }
    ]);

    cotizadorVehiculoControllers.controller('CotizadorVehiculoPlanesCtr', ['$scope', 'CotizadorVehiculoService', '$state', '$timeout', '$filter',
        'transform', 'mensaje', '$modal',
        function($scope, CotizadorVehiculoService, $state, $timeout, $filter, transform, mensaje, $modal) {
            $scope.$parent.ambienteActivo = 2;
            $scope.editSuma = false;
            $scope.inicializar = function() {
                //Obtener planes
                $scope.clean();


                CotizadorVehiculoService.usuarioActual.execute({}, function(data) {
                    $scope.usuario = data;
                    $scope.usuario.codinter = data;
                }, function(response) {
                    mensaje.errorRed('Cargando Usuario', response.status);

                });



                CotizadorVehiculoService.planes.execute({
                        "nano": $scope.vehiculo.anio,
                        "ccodmarca": $scope.vehiculo.marca.valor,
                        "ccodmodelo": $scope.vehiculo.modelo.codmodelo,
                        "ccodversion": $scope.vehiculo.version.valor,
                        "ccodprod": "3001",
                        "ncodinter": $scope.intermediario.codinter
                    },

                    function(listaPlanes) {
                        var error = 0;
                        if (listaPlanes.plan_cur.length == 0) {
                            mensaje.adver("De superar el año 2003,favor notificarlo a la Oficina Principal");
                            $scope.$parent.vehiculo.anio = undefined;
                            $scope.$parent.vehiculo.marca = undefined;
                            $scope.$parent.vehiculo.modelo = undefined;
                            $scope.$parent.vehiculo.version = undefined;
                            $scope.$parent.vehiculo.cerokm = undefined;
                            $(".previous").click();

                        } else {

                            for (var i = 0; i < listaPlanes.plan_cur.length; i++) {
                                if (listaPlanes.plan_cur[i].indrecomendada == "N") {
                                    var indice = $scope.$parent.ambientePlan.planes.length;
                                    $scope.$parent.ambientePlan.planes.push(listaPlanes.plan_cur[i]);
                                    $scope.$parent.ambientePlan.planes[indice].indmodsuma = 'N';
                                    $scope.obtenerCoberturasObligatorias(indice, $scope.obtenerCoberturasAdicionales);
                                    $scope.$parent.ambientePlan.planes[indice].descuento = 0;
                                    $scope.$parent.ambientePlan.planes[indice].codprod;
                                    $scope.$parent.ambientePlan.planes[indice].inddeducible;
                                    //console.log($scope.$parent.ambientePlan.planes[indice].codprod);
                                    // console.log($scope.$parent.ambientePlan.planes[indice].codplan);
                                    //console.log($scope.$parent.ambientePlan.planes[indice].revplan);
                                    $scope.$parent.ambientePlan.planes[indice].codplan;
                                    $scope.$parent.ambientePlan.planes[indice].revplan;
                                    $scope.$parent.ambientePlan.planes[indice].inddeducible;
                                    //$scope.obtenerdeducible(indice);
                                    $scope.$parent.ambientePlan.planes[indice].coberturaSeleccionadas = [];
                                    $scope.$parent.ambientePlan.planes[indice].indice = indice;
                                    $scope.$parent.ambientePlan.planes[indice].mostrarEdicion = [];
                                } else {
                                    $scope.$parent.ambientePlan.plan = listaPlanes.plan_cur[i];
                                }
                            }

                            $scope.$parent.ambientePlan.plan.idCobertAdicional = null,
                                $scope.$parent.ambientePlan.plan.idCobertObligatoria = null,
                                $scope.$parent.ambientePlan.plan.codprod;
                            $scope.$parent.ambientePlan.plan.codplan;
                            $scope.$parent.ambientePlan.plan.revplan;
                            //console.log($scope.$parent.ambientePlan.plan.codprod);
                            //console.log($scope.$parent.ambientePlan.plan.codplan);
                            //console.log($scope.$parent.ambientePlan.plan.revplan);
                            $scope.$parent.ambientePlan.plan.inddeducible;
                            $scope.obtenerdeducible2();
                            $scope.$parent.ambientePlan.plan.seleccion = Object();
                            $scope.$parent.ambientePlan.plan.coberturaSeleccionadas = [];
                            $scope.$parent.ambientePlan.plan.descuento = 0;
                            $scope.$parent.ambientePlan.plan.indmodsuma = 'N';
                            $scope.$parent.ambientePlan.plan.mostrarEdicion = [];
                            $scope.obtenerCoberturasObligatorias(undefined, $scope.obtenerCoberturasAdicionales);
                        }
                    },
                    function(response) {
                        mensaje.errorRed('Cargando Planes', response.status, true);
                    });
            };


            //Se busca Deducible en PlanNRecomendado
            $scope.obtenerdeducible = function(indice) {

                $scope.$parent.ambientePlan.cargado = 1;
                var plan = Object();
                plan = $scope.$parent.ambientePlan.planes[indice];
                //console.log("plannore");
                var planes = $scope.$parent.ambientePlan.planes;
                $scope.$parent.ambientePlan.plan.descuento = '0', //Agregado para pruebas de descuento 0 23/06/16
                    //console.log($scope.$parent.ambientePlan.planes);
                    //console.log(plan.inddeducible)
                    // if (planes.inddeducible == "S")
                    //console.log('holanre');
                    //$scope.deduciblecodred = null;
                    //$scope.deduciblecod = null;
                    //console.log($scope.deduciblecodred);
                    //console.log($scope.deduciblecod);
                    //obtenerCoberturasObligatorias(indice);
                    CotizadorVehiculoService.deducible.execute({
                        "ccodprod": $scope.ambientePlan.planSeleccionado.codprod,
                        "ccodplan": $scope.ambientePlan.planSeleccionado.codplan,
                        "crevplan": $scope.ambientePlan.planSeleccionado.revplan
                    }, function(data) {
                        $scope.deducibles = data.dedu_cur;
                        //$scope.obtenerCoberturasObligatorias(indice,undefined)
                        //obtenerCoberturasObligatorias(indice, coberturasAdicionales);
                        //alert("hola soy no recomendado");
                    }, function(response) {
                        mensaje.errorRed('Cargando Lista de Deducibles', response.status, true);
                    });

            };








            //Se busca Deducible en PlanRecomendado
            $scope.obtenerdeducible2 = function() {

                var plan = $scope.$parent.ambientePlan.plan;
                //console.log("planre");
                //$scope.deduciblecod = null;
                if ($scope.$parent.ambientePlan.plan.inddeducible == "S") {
                    //console.log("holarereco");
                    $scope.$parent.ambientePlan.plan.descuento = '0', //Agregado para pruebas de descuento 0 23/06/16
                        //$scope.deduciblecodred = null;
                        //console.log($scope.deduciblecodred);
                        //console.log($scope.deduciblecod);
                        CotizadorVehiculoService.deducible.execute({
                            "ccodprod": plan.codprod,
                            "ccodplan": plan.codplan,
                            "crevplan": plan.revplan
                        }, function(data) {
                            $scope.deducibles = data.dedu_cur;
                            //alert("hola soy recomendado");
                        }, function(response) {
                            mensaje.errorRed('Cargando Lista de Deducibles', response.status, true);
                        });
                };
            };


            function deducibleid(id) {
                for (var i = 0; i < $scope.deducibles.length; i++) {
                    if ($scope.deducibles[i].codded == id) {
                        return $scope.deducibles[i];
                    };
                };
            };



            $scope.clean = function() {
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

            $scope.tarificarCoberturasAdicionales = function(cobertura, remover) {
                //$timeout(function() {
                remover = typeof remover !== 'undefined' ? "N" : "S";
                if (remover == 'S' && cobertura.codcobert == 'MOT1'){
                    CotizadorVehiculoService.tarificarCoberturasAdicionales.execute({
                            "ccodprod": $scope.ambientePlan.planSeleccionado.codprod,
                            "ccodplan": $scope.ambientePlan.planSeleccionado.codplan,
                            "crevplan": $scope.ambientePlan.planSeleccionado.revplan,
                            "indeducible": $scope.ambientePlan.planSeleccionado.inddeducible,
                            "ccodramo": cobertura.codramocert,
                            "ccodcobert": cobertura.codcobert, //$parent.reservan
                            "nsumaasegcobertmod": 0, //? cobertura.sumaasegcobert : 0,
                            "nidcobadic": $scope.ambientePlan.planSeleccionado.idCobertAdicional,
                            "nidcobobli": $scope.ambientePlan.planSeleccionado.idCobertObligatoria,
                            "indinclusioncob": remover,
                            "ntarireserva": 0,
                        }, function(response) {
                            cobertura.sumaasegmoneda = 0;
                            cobertura.primamoneda = 0;
                            $scope.ambientePlan.planSeleccionado.primatotal = 0;
                        }, function(response) {
                            mensaje.errorRed('Cargando Coberturas Adicionales', response.status, true);

                        });

                }
                CotizadorVehiculoService.tarificarCoberturasAdicionales.execute({
                    "ccodprod": $scope.ambientePlan.planSeleccionado.codprod,
                    "ccodplan": $scope.ambientePlan.planSeleccionado.codplan,
                    "crevplan": $scope.ambientePlan.planSeleccionado.revplan,
                    "indeducible": $scope.ambientePlan.planSeleccionado.inddeducible,
                    "ccodramo": cobertura.codramocert,
                    "ccodcobert": cobertura.codcobert, //$parent.reservan
                    //"nsumaasegcobertmod": cobertura.sumaasegmoneda ? cobertura.sumaasegmoneda : 0, //? cobertura.sumaasegcobert : 0,
                    "nsumaasegcobertmod": cobertura.sumaasegmoneda ? cobertura.sumaasegmoneda : 0, //? cobertura.sumaasegcobert : 0,
                    "nidcobadic": $scope.ambientePlan.planSeleccionado.idCobertAdicional,
                    "nidcobobli": $scope.ambientePlan.planSeleccionado.idCobertObligatoria,
                    "indinclusioncob": remover,
                    "ntarireserva": 0
                },  function(response) {
                    if (response.cober_cur[0].mensajeerror !== null) {
                        mensaje.adver(response.cober_cur[0].mensajeerror);
                        $scope.ambientePlan.planSeleccionado.reservacod = 0;
                        CotizadorVehiculoService.tarificarCoberturasAdicionales.execute({
                            "ccodprod": $scope.ambientePlan.planSeleccionado.codprod,
                            "ccodplan": $scope.ambientePlan.planSeleccionado.codplan,
                            "crevplan": $scope.ambientePlan.planSeleccionado.revplan,
                            "indeducible": $scope.ambientePlan.planSeleccionado.inddeducible,
                            "ccodramo": cobertura.codramocert,
                            "ccodcobert": cobertura.codcobert, //$parent.reservan
                            "nsumaasegcobertmod": 0, //? cobertura.sumaasegcobert : 0,
                            "nidcobadic": $scope.ambientePlan.planSeleccionado.idCobertAdicional,
                            "nidcobobli": $scope.ambientePlan.planSeleccionado.idCobertObligatoria,
                            "indinclusioncob": remover,
                            "ntarireserva": 0,
                        }, function(response) {
                            cobertura.sumaasegmoneda = 0;
                            cobertura.primamoneda =0;
                            $scope.ambientePlan.planSeleccionado.primatotal = 0;
                        }, function(response) {
                            mensaje.errorRed('Cargando Coberturas Adicionales', response.status, true);

                        });
                    } else {
                            //$scope.obtenerCoberturasAdicionales(cobertura)
                        //$timeout(function() {
                            cobertura.sumaasegmoneda = parseFloat(response.cober_cur[0].sumaasegmoneda);
                            cobertura.primamoneda = parseFloat(response.cober_cur[0].mtoprimacobert);
                            $scope.ambientePlan.planSeleccionado.primatotal = parseFloat(response.cober_cur[0].mtoprimafinal);

                  }
                }, function(response) {
                    mensaje.errorRed('Cargando Coberturas Adicionales', response.status, true);
                });
          //  }, 100);

            };



            // TODO: Tarifica Coberturas adicionales con reserva
            $scope.tarificarCoberturasAdicionaless = function(cobertura, remover) {
                    //$timeout(function() {
                remover = typeof remover !== 'undefined' ? "N" : "S";
                //if($scope.ambientePlan.planSeleccionado.reservass == undefined){
                   // CotizadorVehiculoService.tarificarCoberturasAdicionales.execute({
                           //     "ccodprod": $scope.ambientePlan.planSeleccionado.codprod,
                          //      "ccodplan": $scope.ambientePlan.planSeleccionado.codplan,
                           //     "crevplan": $scope.ambientePlan.planSeleccionado.revplan,
                           //     "indeducible": $scope.ambientePlan.planSeleccionado.inddeducible,
                          //      "ccodramo": cobertura.codramocert,
                          //      "ccodcobert": cobertura.codcobert, //$parent.reservan
                          //      "nsumaasegcobertmod": cobertura.sumaasegcobert ? cobertura.sumaasegcobert : 0,
                          //      "nidcobadic": $scope.ambientePlan.planSeleccionado.idCobertAdicional,
                          //      "nidcobobli": $scope.ambientePlan.planSeleccionado.idCobertObligatoria,
                          //      "indinclusioncob": remover,
                          //      "ntarireserva": 0,
                           // }, function(response) {
                          //      cobertura.sumaasegmoneda = parseFloat(response.cober_cur[0].sumaasegmoneda);
                          //      cobertura.primamoneda = parseFloat(response.cober_cur[0].mtoprimacobert);
                          //      $scope.ambientePlan.planSeleccionado.primatotal = parseFloat(response.cober_cur[0].mtoprimafinal);
                          //  }, function(response) {
                          //      mensaje.errorRed('Cargando Coberturas Adicionales', response.status, true);

                          //  });

                //}else{

                    CotizadorVehiculoService.tarificarCoberturasAdicionales.execute({
                        "ccodprod": $scope.ambientePlan.planSeleccionado.codprod,
                        "ccodplan": $scope.ambientePlan.planSeleccionado.codplan,
                        "crevplan": $scope.ambientePlan.planSeleccionado.revplan,
                        "indeducible": $scope.ambientePlan.planSeleccionado.inddeducible,
                        "ccodramo": cobertura.codramocert,
                        "ccodcobert": cobertura.codcobert, //$parent.reservan
                        "nsumaasegcobertmod": $scope.ambientePlan.planSeleccionado.reservass.suma ? $scope.ambientePlan.planSeleccionado.reservass.suma : 0, //? cobertura.sumaasegcobert : 0,
                        "nidcobadic": $scope.ambientePlan.planSeleccionado.idCobertAdicional,
                        "nidcobobli": $scope.ambientePlan.planSeleccionado.idCobertObligatoria,
                        "indinclusioncob": remover,
                        "ntarireserva": $scope.ambientePlan.planSeleccionado.reservass.codtarif ? $scope.ambientePlan.planSeleccionado.reservass.codtarif : 0
                    },  function(response) {
                        if (response.cober_cur[0].mensajeerror !== null) {
                            mensaje.adver(response.cober_cur[0].mensajeerror);
                            //$scope.ambientePlan.planSeleccionado.reservass.codtarif = 0;
                            CotizadorVehiculoService.tarificarCoberturasAdicionales.execute({
                                "ccodprod": $scope.ambientePlan.planSeleccionado.codprod,
                                "ccodplan": $scope.ambientePlan.planSeleccionado.codplan,
                                "crevplan": $scope.ambientePlan.planSeleccionado.revplan,
                                "indeducible": $scope.ambientePlan.planSeleccionado.inddeducible,
                                "ccodramo": cobertura.codramocert,
                                "ccodcobert": cobertura.codcobert, //$parent.reservan
                                "nsumaasegcobertmod": 0, //? cobertura.sumaasegcobert : 0,
                                "nidcobadic": $scope.ambientePlan.planSeleccionado.idCobertAdicional,
                                "nidcobobli": $scope.ambientePlan.planSeleccionado.idCobertObligatoria,
                                "indinclusioncob": remover,
                                "ntarireserva": 0,
                            }, function(response) {
                                cobertura.sumaasegmoneda = 0;
                                cobertura.primamoneda =0;
                                $scope.ambientePlan.planSeleccionado.primatotal = 0;
                            }, function(response) {
                                mensaje.errorRed('Cargando Coberturas Adicionales', response.status, true);

                            });
                        } else {
                                //$scope.obtenerCoberturasAdicionales(cobertura)
                            //$timeout(function() {

                                cobertura.sumaasegmoneda = parseFloat(response.cober_cur[0].sumaasegmoneda);
                                cobertura.primamoneda = parseFloat(response.cober_cur[0].mtoprimacobert);
                                $scope.ambientePlan.planSeleccionado.primatotal = parseFloat(response.cober_cur[0].mtoprimafinal);

                      }

                    }, function(response) {
                        mensaje.errorRed('Cargando Coberturas Adicionales', response.status, true);
                    });
               // }
              //  }, 100);

            };

            // TODO: Tarifica Coberturas adicionales con reserva
            $scope.tarificarCoberturasAdicionalesss = function(cobertura, remover) {
                    //$timeout(function() {
                remover = typeof remover !== 'undefined' ? "N" : "S";
                cobertura.sumaasegmoneda = 0;
                cobertura.primamoneda =0;
                CotizadorVehiculoService.tarificarCoberturasAdicionales.execute({
                        "ccodprod": $scope.ambientePlan.planSeleccionado.codprod,
                        "ccodplan": $scope.ambientePlan.planSeleccionado.codplan,
                        "crevplan": $scope.ambientePlan.planSeleccionado.revplan,
                        "indeducible": $scope.ambientePlan.planSeleccionado.inddeducible,
                        "ccodramo": cobertura.codramocert,
                        "ccodcobert": cobertura.codcobert, //$parent.reservan
                        "nsumaasegcobertmod": $scope.ambientePlan.planSeleccionado.danos !== undefined ? $scope.ambientePlan.planSeleccionado.danos.porcentaje: 0, //? cobertura.sumaasegcobert : 0,
                        "nidcobadic": $scope.ambientePlan.planSeleccionado.idCobertAdicional,
                        "nidcobobli": $scope.ambientePlan.planSeleccionado.idCobertObligatoria,
                        "indinclusioncob": remover,
                        "ntarireserva":   $scope.ambientePlan.planSeleccionado.danos !== undefined  ?  $scope.ambientePlan.planSeleccionado.danos.codtarif: 0
                    },  function(response) {
                        if (response.cober_cur[0].mensajeerror !== null) {
                            mensaje.adver(response.cober_cur[0].mensajeerror);
                            //$scope.ambientePlan.planSeleccionado.reservass.codtarif = 0;
                            CotizadorVehiculoService.tarificarCoberturasAdicionales.execute({
                                "ccodprod": $scope.ambientePlan.planSeleccionado.codprod,
                                "ccodplan": $scope.ambientePlan.planSeleccionado.codplan,
                                "crevplan": $scope.ambientePlan.planSeleccionado.revplan,
                                "indeducible": $scope.ambientePlan.planSeleccionado.inddeducible,
                                "ccodramo": cobertura.codramocert,
                                "ccodcobert": cobertura.codcobert, //$parent.reservan
                                "nsumaasegcobertmod": 0, //? cobertura.sumaasegcobert : 0,
                                "nidcobadic": $scope.ambientePlan.planSeleccionado.idCobertAdicional,
                                "nidcobobli": $scope.ambientePlan.planSeleccionado.idCobertObligatoria,
                                "indinclusioncob": remover,
                                "ntarireserva": 0,
                            }, function(response) {
                                cobertura.sumaasegmoneda = 0;
                                cobertura.primamoneda =0;
                                $scope.ambientePlan.planSeleccionado.primatotal = 0;
                            }, function(response) {
                                mensaje.errorRed('Cargando Coberturas Adicionales', response.status, true);

                            });
                        } else {
                                //$scope.obtenerCoberturasAdicionales(cobertura)
                            //$timeout(function() {

                                cobertura.sumaasegmoneda = parseFloat(response.cober_cur[0].sumaasegmoneda);
                                cobertura.primamoneda = parseFloat(response.cober_cur[0].mtoprimacobert);
                                $scope.ambientePlan.planSeleccionado.primatotal = parseFloat(response.cober_cur[0].mtoprimafinal);

                      }

                    }, function(response) {
                        mensaje.errorRed('Cargando Coberturas Adicionales', response.status, true);
                    });
               // }
              //  }, 100);

            };

            $scope.obtenerCoberturasObligatorias = function(indice, coberturasAdicionales) {
                //var planes = typeof indice !== 'undefined' ?  $scope.ambientePlan.planes[indice] : $scope.ambientePlan.plan;
                var plan = $scope.ambientePlan.planes[indice] ? $scope.ambientePlan.planes[indice] : $scope.ambientePlan.plan;
                var descuento = typeof indice !== 'undefined' ? $scope.ambientePlan.planes[indice].descuento : $scope.ambientePlan.plan.descuento;
                    CotizadorVehiculoService.cobertura.execute({
                            "ccodprod": plan.codprod,
                            "ccodplan": plan.codplan,
                            "crevplan": plan.revplan,
                            "nanoveh": $scope.vehiculo.anio,
                            "nnrosolic": $scope.solicitante.numSolicitud,
                            "cnrosolic": $scope.solicitante.numSolicitud, //TODO:Descomentado por Requisitos
                            "ccodmarca": $scope.vehiculo.marca.valor,
                            "ccodmodelo": $scope.vehiculo.modelo.codmodelo,
                            "ccodversion": $scope.vehiculo.version.valor,
                            "ccodpais": "VNZ",
                            "ccodestado": $scope.solicitante.estado.codestado,
                            "ndescuento": parseInt(descuento) ? descuento : null,
                            "indmodsuma": plan.indmodsuma,
                            "codded": $scope.deduciblecod ? $scope.deduciblecod : $scope.deduciblecodred,
                            "c_coduusuario": 'BMRIVAS',
                            "nsumaaseg": plan.sumaasegurada ? plan.sumaasegurada : null,
                            "idcobadic": plan.idCobertAdicional ? plan.idCobertAdicional : null,
                            "nidcoblig": null
                        },
                        function(listacobertura) {
                            var lista = [];
                            if (listacobertura.cober_cur != null) {
                                for (var i = 0; i < listacobertura.cober_cur.length; i++) {
                                    var cobert = Object();
                                    var item = listacobertura.cober_cur[i];
                                    cobert.desccobert = item.desccobert;
                                    cobert.primamoneda = parseFloat(item.primamoneda);
                                    cobert.sumaasegmoneda = parseFloat(item.sumaasegmoneda);
                                    cobert.codcobert = item.codcobert;
                                    cobert.tasa = parseFloat(item.tasa);
                                    cobert.codramocert = item.codramocert;
                                    cobert.mtodeduciblesin = item.mtodeduciblesin;
                                    cobert.porcdeduciblesin = item.porcdeduciblesin;
                                    lista.push(cobert);
                                }

                            };
                            $scope.$parent.ambientePlan.cargadas = $scope.$parent.ambientePlan.cargadas + 1;
                            plan.coberturasObligatorias = lista;
                            plan.idCobertObligatoria = listacobertura.nidecobertobli;
                            plan.modprima = listacobertura.cmodprima == 'S' ? true : false;
                            plan.primatotal = listacobertura.nprimatotal ? listacobertura.nprimatotal : 0;
                            plan.modsuma = listacobertura.cmodsuma == 'S' ? true : false;
                            plan.mostrarsuma = listacobertura.mostrarsumatotal == 'S' ? true : false;
                            plan.sumaasegurada = listacobertura.nsumaasegtotal;
                            $scope.$parent.coberturaPedida = true;
                            plan.minSumaAseg = listacobertura.nsumamin;
                            plan.maxSumaAseg = listacobertura.nsumamax;
                            plan.maxPersonal = listacobertura.nmodsumamaxesp;
                            plan.sumaAntigua = listacobertura.nsumaasegtotal;
                            plan.editSuma = false;
                            plan.errorreaseguro = listacobertura.cmensajerrorreaseguro;
                            if (plan.errorreaseguro !== null && $scope.usuario.username!=='V20910458' && $scope.usuario.username!=='V13747948' && $scope.usuario.username!=='V17385432' && $scope.usuario.username!=='V6175317'){// TODO: Se agrega usuario nuevo
                              mensaje.adver("Para poder culminar la cotizacion, debe dirigirse a la Oficina comercial mas cercana, debido a que este vehiculo requiere de Reaseguro");
                              $scope.$parent.vehiculo.anio = undefined;
                              $scope.$parent.vehiculo.marca = undefined;
                              $scope.$parent.vehiculo.modelo = undefined;
                              $scope.$parent.vehiculo.version = undefined;
                              $scope.$parent.vehiculo.cerokm = undefined;
                              $(".previous").click();
                            }
                            plan.error = listacobertura.cmensajeerror !== null ? listacobertura.cmensajeerror : false;
                            if (plan.error) {
                                $scope.$parent.ambientePlan.errores = $scope.$parent.ambientePlan.errores + 1;
                            }
                            if ($scope.$parent.ambientePlan.mayorPrima.primatotal < plan.primatotal) {
                                $scope.$parent.ambientePlan.mayorPrima = plan;
                            }
                            if (($scope.ambientePlan.planes.length + 1) == $scope.ambientePlan.cargadas) {
                                if ($scope.ambientePlan.cargadas == $scope.ambientePlan.errores) {
                                    mensaje.adver("De superar el año 2003 en Particulares,rústicos y pick-up y 1995 para camiones,favor notificarlo a la Oficina Principal");
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
                                //$scope.buscareserva(indice);
                            }
                        },
                        function(response) {
                            mensaje.errorRed('Cargando Detalles de Planes y Coberturas Obligatorias', response.status, true);
                        });
                //}, 100);
            };

            $scope.obtenerCoberturasObligatoriass = function(indice, coberturasAdicionales) {
                //var planes = typeof indice !== 'undefined' ?  $scope.ambientePlan.planes[indice] : $scope.ambientePlan.plan;
                var plan = $scope.ambientePlan.planes[indice] ? $scope.ambientePlan.planes[indice] : $scope.ambientePlan.plan;
                var descuento = typeof indice !== 'undefined' ? $scope.ambientePlan.planes[indice].descuento : $scope.ambientePlan.plan.descuento;
            //  $timeout(function() {
                    CotizadorVehiculoService.cobertura.execute({
                            "ccodprod": plan.codprod,
                            "ccodplan": plan.codplan,
                            "crevplan": plan.revplan,
                            "nanoveh": $scope.vehiculo.anio,
                            "cnrosolic": $scope.solicitante.numSolicitud,
                            "ccodmarca": $scope.vehiculo.marca.valor,
                            "ccodmodelo": $scope.vehiculo.modelo.codmodelo,
                            "ccodversion": $scope.vehiculo.version.valor,
                            "ccodpais": "VNZ",
                            "ccodestado": $scope.solicitante.estado.codestado,
                            "ndescuento": parseInt(descuento) ? descuento : null,
                            "indmodsuma": plan.indmodsuma,
                            "codded": $scope.deduciblecod ? $scope.deduciblecod : $scope.deduciblecodred,
                            "c_coduusuario": 'BMRIVAS',
                            "nsumaaseg": plan.sumaasegurada ? plan.sumaasegurada : null,
                            "idcobadic": plan.idCobertAdicional ? plan.idCobertAdicional : null,
                            "nidcoblig": plan.idCobertObligatoria

                          },
                          function(listacobertura) {
                              var lista = [];
                              if (listacobertura.cober_cur != null) {
                                  for (var i = 0; i < listacobertura.cober_cur.length; i++) {
                                      var cobert = Object();
                                      var item = listacobertura.cober_cur[i];
                                      cobert.desccobert = item.desccobert;
                                      cobert.primamoneda = parseFloat(item.primamoneda);
                                      cobert.sumaasegmoneda = parseFloat(item.sumaasegmoneda);
                                      cobert.codcobert = item.codcobert;
                                      cobert.tasa = parseFloat(item.tasa);
                                      cobert.codramocert = item.codramocert;
                                      cobert.mtodeduciblesin = item.mtodeduciblesin;
                                      cobert.porcdeduciblesin = item.porcdeduciblesin;
                                      lista.push(cobert);
                                  }

                              };
                              $scope.$parent.ambientePlan.cargadas = $scope.$parent.ambientePlan.cargadas + 1;
                              plan.coberturasObligatorias = lista;
                              plan.idCobertObligatoria = listacobertura.nidecobertobli;
                              plan.modprima = listacobertura.cmodprima == 'S' ? true : false;
                              //plan.primatotal = listacobertura.nprimatotal ? listacobertura.nprimatotal : 0;
                              plan.modsuma = listacobertura.cmodsuma == 'S' ? true : false;
                              plan.mostrarsuma = listacobertura.mostrarsumatotal == 'S' ? true : false;
                              plan.sumaasegurada = listacobertura.nsumaasegtotal;
                              $scope.$parent.coberturaPedida = true;
                              plan.minSumaAseg = listacobertura.nsumamin;
                              plan.maxSumaAseg = listacobertura.nsumamax;
                              plan.maxPersonal = listacobertura.nmodsumamaxesp;
                              plan.sumaAntigua = listacobertura.nsumaasegtotal;
                              plan.editSuma = false;
                              plan.errorreaseguro = listacobertura.cmensajerrorreaseguro !== null ? listacobertura.cmensajerrorreaseguro : null;
                              plan.error = listacobertura.cmensajeerror !== null ? listacobertura.cmensajeerror : false;
                              if (plan.error) {
                                  $scope.$parent.ambientePlan.errores = $scope.$parent.ambientePlan.errores + 1;
                              }
                              if ($scope.$parent.ambientePlan.mayorPrima.primatotal < plan.primatotal) {
                                  $scope.$parent.ambientePlan.mayorPrima = plan;
                              }
                              if (($scope.ambientePlan.planes.length + 1) == $scope.ambientePlan.cargadas) {
                                  if ($scope.ambientePlan.cargadas == $scope.ambientePlan.errores) {
                                      mensaje.adver("De superar el año 2003 en Particulares,rústicos y pick-up y 1995 para camiones,favor notificarlo a la Oficina Principal");
                                      $scope.$parent.vehiculo.anio = undefined;
                                      $scope.$parent.vehiculo.marca = undefined;
                                      $scope.$parent.vehiculo.modelo = undefined;
                                      $scope.$parent.vehiculo.version = undefined;
                                      $scope.$parent.vehiculo.cerokm = undefined;
                                      $(".previous").click();
                                  }
                                  if (plan.errorreaseguro !== null){ //&& $scope.usuario.username!=='V20910458' && $scope.usuario.username!=='V13747948' && $scope.usuario.username!=='V6175317'&& $scope.usuario.username!=='V10091906'){
                                    mensaje.adver("Para poder culminar la cotizacion, debe dirigirse a la Oficina comercial mas cercana, debido a que este vehiculo requiere de Reaseguro");
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
                                  //$scope.buscareserva(indice);
                              }

                          },

                          function(response) {
                              mensaje.errorRed('Cargando Detalles de Planes y Coberturas Obligatorias', response.status, true);
                          });
                  //}, 100);
            };

            $scope.reserva = function(indice){
                var plan = typeof indice !== 'undefined' ?  $scope.ambientePlan.planes[indice] : $scope.ambientePlan.plan;
                    $scope.obtenerCoberturasObligatoriass(indice);

            }

            $scope.obtenerCoberturasAdicionales = function(indice, cobertura) {
                var plan = typeof indice !== 'undefined' ? $scope.ambientePlan.planes[indice] : $scope.ambientePlan.plan;
                CotizadorVehiculoService.coberturasAdicionales.execute({
                        "ccodprod": plan.codprod,
                        "ccodplan": plan.codplan,
                        "crevplan": plan.revplan,
                        "nanoveh": $scope.vehiculo.anio,
                        "ccodmarca": $scope.vehiculo.marca.valor,
                        "ccodmodelo": $scope.vehiculo.modelo.codmodelo,
                        "ccodversion": $scope.vehiculo.version.valor,
                        "ccodpais": "VNZ",
                        "ccodestado": $scope.solicitante.estado.codestado,
                        "ndescuento": null,
                        "indmodsuma": plan.indmodsuma,
                        "c_coduusuario": 'BMRIVAS',
                        "nsumaaseg": plan.sumaasegurada ? plan.sumaasegurada : null,
                        "nindrecomendada": 'N',
                        "nidecobertobli": plan.idCobertObligatoria ? plan.idCobertObligatoria : null,
                        "cnrosolic": $scope.solicitante.numSolicitud, //TODO:Descomentado por Requisitos
                        "nnrosolic": $scope.solicitante.numSolicitud
                    },
                    function(response) {
                        plan.coberturasAdicionales = response.cober_cur;
                        for (var i = 0; i < plan.coberturasAdicionales.length; i++) {
                            plan.coberturasAdicionales[i].codcompleto = plan.coberturasAdicionales[i].codramocert + plan.coberturasAdicionales[i].codcobert;

                        };

                        plan.idCobertAdicional = response.nidecobertadic;
                    },
                    function(response) {
                        mensaje.errorRed("Cargando Coberturas Adicionales", response.status, true);
                    });


                CotizadorVehiculoService.planesreservas.execute({
                        "ccodprod": $scope.ambientePlan.planSeleccionado.codprod,
                        "ccodplan": $scope.ambientePlan.planSeleccionado.codplan,
                        "crevplan": $scope.ambientePlan.planSeleccionado.revplan,
                        "ccodramo": 'CA32',
                        "ccodcobert": '0050',
                        "nanoveh": $scope.vehiculo.anio,
                        "ccodmarca": $scope.vehiculo.marca.valor,
                        "ccodmodelo": $scope.vehiculo.modelo.codmodelo,
                        "ccodversion": $scope.vehiculo.version.valor

                    },
                    function(data) {
                        $scope.reservas = data.rese_cur;

                    },
                    function(response) {
                        mensaje.errorRed('Cargando Lista de reserva', response.status, true);
                    });

                   
                CotizadorVehiculoService.planesmaliciosos.execute({
                        "ccodprod": $scope.ambientePlan.planSeleccionado.codprod,
                        "ccodplan": $scope.ambientePlan.planSeleccionado.codplan,
                        "crevplan": $scope.ambientePlan.planSeleccionado.revplan,
                        "ccodramo": 'CA32',
                        "ccodcobert": "MOT1",
                        "nanoveh": $scope.vehiculo.anio,
                        "ccodmarca": $scope.vehiculo.marca.valor,
                        "ccodmodelo": $scope.vehiculo.modelo.codmodelo,
                        "ccodversion": $scope.vehiculo.version.valor,
                        "ccodestado": $scope.solicitante.estado.codestado
                        },
                        function(data) {
                            $scope.dano = data.porc_cur;
                        },
                        function(response) {
                            mensaje.errorRed('Cargando Lista de dano', response.status, true);
                        });

            };

            if (!$scope.coberturaPedida) {
                $scope.inicializar();
            }

            $scope.seleccionarPlan = function(indice) {
                $scope.$parent.ambientePlan.cargado = 1;
                var plan = Object();
                if (typeof indice === 'undefined') {
                    plan = $scope.$parent.ambientePlan.plan;
                } else if (indice == -1) {
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
                    $scope.$parent.ambientePago.pagoSeleccionado = undefined;
                }
            };

            $scope.enviarSuma = function(indice) {
                var plan = typeof indice !== 'undefined' ? $scope.ambientePlan.planes[indice] : $scope.ambientePlan.plan;
                var sum = plan.sumaasegurada;
                var max = plan.maxPersonal > plan.maxSumaAseg ? plan.maxPersonal : plan.maxSumaAseg;
                if (sum <= max && sum >= plan.minSumaAseg) {
                    plan.editSuma = false;
                    plan.indmodsuma = 'S';
                    $scope.obtenerCoberturasObligatorias(indice, undefined);
                    CotizadorVehiculoService.validaSumaEspecial.execute({
                        'sumaasegurada': sum,
                        'sumaasegmaxima': plan.maxSumaAseg
                    }, function(data) {
                        if (data.mensaje != "" && data.mensaje != undefined) {
                            mensaje.info(data.mensaje);
                        };
                    });
                } else {
                    $scope.error = true;
                    $timeout(function() {
                        $scope.error = false;
                    }, 4000);
                }
            };

            $scope.noEnviarSuma = function(indice) {
                var plan = typeof indice !== 'undefined' ? $scope.$parent.ambientePlan.planes[indice] : $scope.$parent.ambientePlan.plan;
                plan.editSuma = false;
                plan.sumaasegurada = plan.sumaAntigua;
            };

            $scope.$watch('editSuma', function(value) {
                if (value === true) {
                    $timeout(function() {
                        slider(jQuery);
                        $scope.sumaAntigua = $scope.ambientePlan.plan.sumaasegurada;
                        $('#suma').focus();
                    }, 100);
                }
            });

            $scope.mostrarCoberturasAdicionales = function() {
                if ($scope.ambientePlan.planSeleccionado.coberturasAdicionales && $scope.ambientePlan.planSeleccionado.coberturasAdicionales.length > 0) {
                    var modalInstance = $modal.open({
                        templateUrl: 'views/cotizador/vehiculo/coberturas_adicionales.html',
                        controller: 'CotizadorVehiculoCoberturaAd',
                        backdrop: 'static',
                        scope: $scope
                    });
                } else {
                    mensaje.info("Este plan no posee coberturas adicionales");
                };
            };



            CotizadorVehiculoService.descuento.execute({
                "c_coduusuario": "BMRIVAS"
            }, function(data) {
                $scope.maxDescuento = data.descuento;
                $timeout(function() {
                    slider(jQuery);
                }, 200);
            }, function(response) {
                mensaje.errorRed('Cargando Descuento Máximo del Usuario', response.status, true);
            });
            /*
 // Llama al deducible para cargar cuando te regresas de pago  PlanesN Recomendado
              CotizadorVehiculoService.deducible.execute({
                 "ccodprod": $scope.$parent.ambientePlan.planes.codprod,
                 "ccodplan": $scope.$parent.ambientePlan.planes.codplan,
                 "crevplan": $scope.$parent.ambientePlan.planes.revplan
             }, function(data) {
                 $scope.deducibles = data.dedu_cur;
                 $timeout(function(){
                    slider(jQuery);
                },200);
             }, function(response) {
                 mensaje.errorRed('Cargando Lista de Deducibles', response.status, true);
             });
            */
            // Llama al deducible para cargar cuando te regresas de pago  Planes Recomendado
            CotizadorVehiculoService.deducible.execute({
                //$scope.ambientePlan.planSeleccionado
                //"ccodprod": $scope.ambientePlan.plan.codprod,
                //"ccodplan": $scope.ambientePlan.plan.codplan,
                // "crevplan": $scope.ambientePlan.plan.revplan
                "ccodprod": $scope.ambientePlan.planSeleccionado.codprod,
                "ccodplan": $scope.ambientePlan.planSeleccionado.codplan,
                "crevplan": $scope.ambientePlan.planSeleccionado.revplan


            }, function(data) {
                $scope.deducibles = data.dedu_cur;
                $timeout(function() {
                    slider(jQuery);
                }, 200);
            }, function(response) {
                mensaje.errorRed('Cargando Lista de Deducibles', response.status, true);
            });
            // FIN Llama al deducible para cargar cuando te regresas de pago  Planes Recomendado && PlanesN Recomendado


            $scope.editarCobertura = function(index, edita, cobertura, plan) {
                if (edita) {
                    $scope.ambientePlan.planSeleccionado.mostrarEdicion[index] = true;
                    $timeout(function() {
                        $('#sumaaseg' + plan.codplan + plan.revplan + '_' + index).focus();
                    }, 100);
                } else {
                    if (parseInt(cobertura.sumaasegmoneda) > parseInt(cobertura.sumaasegmax) || parseInt(cobertura.sumaasegmoneda) < parseInt(cobertura.sumaasegmin)) {
                        mensaje.adver("El monto ingresado esta fuera de los limites permitidos. Por lo que el mismo se ajustará al valor más conveniente en base a su elección.");
                        if (parseInt(cobertura.sumaasegmoneda) > parseInt(cobertura.sumaasegmax)) {
                            cobertura.sumaasegmoneda = cobertura.sumaasegmax;
                        } else {
                            cobertura.sumaasegmoneda = cobertura.sumaasegmin;
                        }
                    } else {
                        $scope.ambientePlan.planSeleccionado.mostrarEdicion[index] = false;
                        $scope.tarificarCoberturasAdicionales(cobertura);
                    }
                }
            };
        }
    ]);

    cotizadorVehiculoControllers.controller('CotizadorVehiculoCoberturaAd', ['$scope', 'CotizadorVehiculoService', '$state', 'mensaje', '$modalInstance', '$timeout',
        function($scope, CotizadorVehiculoService, $state, mensaje, $modalInstance, $timeout) {
            $scope.actualizarCoberturas = function(cobertura) {
                $timeout(function() {
                    if ($scope.ambientePlan.planSeleccionado.seleccion[cobertura.codcompleto]) {
                        cobertura.sumaasegmoneda = parseFloat(cobertura.sumaasegmin);
                        $scope.tarificarCoberturasAdicionales(cobertura);
                        $scope.ambientePlan.planSeleccionado.coberturaSeleccionadas.push(cobertura);
                    } else {
                        var index = $scope.ambientePlan.planSeleccionado.coberturaSeleccionadas.indexOf(cobertura);
                        if (index > -1) {
                            $scope.ambientePlan.planSeleccionado.coberturaSeleccionadas.splice(index, 1);
                            if (cobertura.codcobert=='MOT1'){
                                $scope.ambientePlan.planSeleccionado.danos = ''
                                cobertura.sumaasegmoneda = ''
                                cobertura.primamoneda=''
                            }
                            $scope.tarificarCoberturasAdicionales(cobertura, true);
                        }
                    }
                    //if(cobertura.codcobert == '0050') {
                    //(cobertura.codcobert == 'RV01'[$scope.disabled= true]);
                    //$scope.disabled= true;
                    //}else{
                    //  if(cobertura.codcobert == 'RV01'){
                    // (cobertura.cobcobert == '0050'[$scope.disabled= true]);
                    //  }else{
                    //  $scope.disabled= false

                    //}
                    //$scope.disabled= false
                    //}

                    //$scope.disabled= true;


                }, 500);
            };

            $scope.ok = function() {
                $modalInstance.close();
                slider(jQuery);
            };
        },


    ]);

    cotizadorVehiculoControllers.controller('CotizadorVehiculoPagoCtr', ['$scope', 'CotizadorVehiculoService', '$state', 'transform', 'mensaje',
        function($scope, CotizadorVehiculoService, $state, transform, mensaje) {
            $scope.$parent.ambienteActivo = 3;

            $scope.recalcularPago = function(pago) {
                if (parseInt(pago.porcinicial) < pago.porcinicialmin || parseInt(pago.porcinicial) > pago.porcinicialmax) {
                    mensaje.error("El valor seleccionado de Porcentaje Inicial no es válido, se ajustará en base a los valores y permitidos y el valor de su elección.");
                    if (pago.porcinicial < pago.porcinicialmin) {
                        pago.porcinicial = pago.porcinicialmin;
                    } else {
                        pago.porcinicial = pago.porcinicialmax;
                    };
                };

                if (parseInt(pago.cantgiros) < pago.cantgirosmin || parseInt(pago.cantgiros) > pago.cantgirosmax) {
                    mensaje.error("El valor seleccionado de Cantidad de Giros no es válido, se ajustará en base a los valores y permitidos y el valor de su elección.");
                    if (pago.cantgiros < pago.cantgirosmin) {
                        pago.cantgiros = pago.cantgirosmin;
                    } else {
                        pago.cantgiros = pago.cantgirosmax;
                    };
                };

                if (parseFloat(pago.montoinicial) > parseFloat($scope.ambientePlan.planSeleccionado.primatotal)) {
                    mensaje.error("El valor seleccionado de Monto Inicial es superior a la Prima, se ajustará en base a los valores y permitidos y el valor de su elección.");
                    pago.montoinicial = '0';
                    pago.porcinicial = pago.porcinicialmin;
                };

                CotizadorVehiculoService.calculoFinanciamiento.execute({
                    'ncotizacion': $scope.solicitante.numSolicitud,
                    'ccodplan': $scope.ambientePlan.planSeleccionado.codplan,
                    'crevplan': $scope.ambientePlan.planSeleccionado.revplan,
                    'nmtoprima': parseFloat($scope.ambientePlan.planSeleccionado.primatotal),
                    'nporcinicial': parseFloat(pago.porcinicial),
                    'ncantgiros': parseInt(pago.cantgiros),
                    'nmtoinicial': parseFloat(pago.montoinicial),
                    //'nporcinicial' : parseInt(pago.porcinicial)
                }, function(data) {
                    if (pago.tipoplan == "F") {
                        pago.mtogiro = parseFloat(data.nmtogiro);
                        pago.inicial_prima = parseFloat(data.nmtoinicial);
                        pago.mtoprestamo = parseFloat(data.nmtoprestamo);
                        pago.montoinicial = parseFloat(data.nmtoinicial);
                        pago.porcinicial = parseFloat(data.nporcinicial);
                        pago.cmensaje = data.cmensaje

                        if (pago.cmensaje != null) {
                            mensaje.error(pago.cmensaje);
                            pago.montoinicial = '0';
                            pago.porcinicial = '0';
                            pago.mtogiro = '0';
                            pago.inicial_prima = '0';
                            pago.mtoprestamo = '0'
                            pago.montoinicial = '0';
                            pago.porcinicial = pago.porcinicialmin;
                        }

                    };
                }, function(response) {
                    mensaje.errorRed('Recalculando Pago', response.status, true);
                });
            };

            $scope.recalcularPagopor = function(pago) {
                if (parseInt(pago.porcinicial) < pago.porcinicialmin || parseInt(pago.porcinicial) > pago.porcinicialmax) {
                    mensaje.error("El valor seleccionado de Porcentaje Inicial no es válido, se ajustará en base a los valores y permitidos y el valor de su elección.");
                    if (pago.porcinicial < pago.porcinicialmin) {
                        pago.porcinicial = pago.porcinicialmin;
                    } else {
                        pago.porcinicial = pago.porcinicialmax;
                    };
                };

                if (parseInt(pago.cantgiros) < pago.cantgirosmin || parseInt(pago.cantgiros) > pago.cantgirosmax) {
                    mensaje.error("El valor seleccionado de Cantidad de Giros no es válido, se ajustará en base a los valores y permitidos y el valor de su elección.");
                    if (pago.cantgiros < pago.cantgirosmin) {
                        pago.cantgiros = pago.cantgirosmin;
                    } else {
                        pago.cantgiros = pago.cantgirosmax;
                    };
                };

                CotizadorVehiculoService.calculoFinanciamiento.execute({
                    'ncotizacion': $scope.solicitante.numSolicitud,
                    'ccodplan': $scope.ambientePlan.planSeleccionado.codplan,
                    'crevplan': $scope.ambientePlan.planSeleccionado.revplan,
                    'nmtoprima': parseFloat($scope.ambientePlan.planSeleccionado.primatotal),
                    'nporcinicial': parseFloat(pago.porcinicial),
                    'ncantgiros': parseInt(pago.cantgiros),
                    'nmtoinicial': '0',
                    //'nporcinicial' : parseInt(pago.porcinicial)
                }, function(data) {
                    if (pago.tipoplan == "F") {
                        pago.mtogiro = parseFloat(data.nmtogiro);
                        pago.inicial_prima = parseFloat(data.nmtoinicial);
                        pago.mtoprestamo = parseFloat(data.nmtoprestamo);
                        pago.montoinicial = parseFloat(data.nmtoinicial);
                        pago.porcinicial = parseFloat(data.nporcinicial);
                        pago.cmensaje = data.cmensaje

                        if (pago.cmensaje != null) {
                            mensaje.error(pago.cmensaje);
                            pago.montoinicial = parseFloat(data.nmtoinicial);
                        }

                    };
                }, function(response) {
                    mensaje.errorRed('Recalculando Pago', response.status, true);
                });
            };



            $scope.seleccionarPago = function(pago) {
                $scope.$parent.ambientePago.pagoSeleccionado = pago;
            };
        }
    ]);

    cotizadorVehiculoControllers.controller('CotizadorVehiculoResumenCtr', ['$scope', 'CotizadorVehiculoService', '$state', 'mensaje',
        function($scope, CotizadorVehiculoService, $state, mensaje) {
            $scope.$parent.ambienteActivo = 4;
            $scope.solicitante = $scope.$parent.solicitante;
            $scope.vehiculo = $scope.$parent.vehiculo;
            $scope.numSolicitud = $scope.$parent.solicitante.numSolicitud; //TODO: esto no debería estar aquí...

            $scope.enviarCotizacion = function() {
                mensaje.enviarCotizacion($scope.numSolicitud, $scope.$parent.solicitante.nombre + " " + $scope.$parent.solicitante.apellidos);
            };
        }
    ]);
});
