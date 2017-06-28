define(['angular'], function (angular) {
    'use strict';
    
    var emisionVehiculoControllers = angular.module('emisionVehiculoControllers', []);
    
    emisionVehiculoControllers.controller('EmisionVehiculoCtr', ['$scope', 'EmisionVehiculoService', '$state', 'mensaje', '$modal', function($scope, EmisionVehiculoService, $state, mensaje, $modal) {
        $scope.tiposId = ['Venezolano', 'Extranjero', 'Pasaporte', 'Jurídico', 'Gubernamental'];
        $scope.edosCivil = ['Soltero','Casado','Divorciado','Viudo'];
        $scope.sexos = ['Femenino', 'Masculino'];
        $scope.ambienteCotizaciones = Object();
        $scope.ambienteVehiculo = Object();
        $scope.ambienteVehiculo.vehiculo = Object();
        $scope.ambienteCliente = Object();
        $scope.ambienteCliente.cliente = Object();
        $scope.ambienteCliente.cliente.tipoId = $scope.tiposId[0];
        $scope.ambienteTomador = Object();
        $scope.ambienteTomador.tomador = Object();
        $scope.ambienteResultado = Object();
        
        EmisionVehiculoService.estado.execute(null,
            function (data) {
                $scope.estados = data.estado_cur;
	    }, function (response) {
	        mensaje.errorRed('Estados',response.status,true);
	});
        EmisionVehiculoService.ciudad.execute(null,
            function (data) {
                $scope.ciudades = data.ciudad_cur;
	    }, function (response) {
	        mensaje.errorRed('Ciudades',response.status,true);
	});
        EmisionVehiculoService.municipio.execute(null,
            function (data) {
                $scope.municipios = data.municipio_cur;
	    }, function (response) {
	        mensaje.errorRed('Municipios',response.status,true);
	});
        EmisionVehiculoService.urbanizacion.execute(
            { 'ccodpais': 'VNZ'},
            function (data) {
                $scope.urbanizaciones = data.urbanizacion_cur;
	    }, function (response) {
	        mensaje.errorRed('Urbanizaciones',response.status,true);
        });
        EmisionVehiculoService.codArea.execute(null,
          function (data) {
              $scope.codAreas = data.codtele_cur;
	  }, function (response) {
	      mensaje.errorRed('Codigos de Area',response.status,true);
	});
        EmisionVehiculoService.usos.execute(null,
           function (data) {
               $scope.ambienteVehiculo.usos = data.usoveh_cur;
           }, function (response) {
               mensaje.errorRed('Usos',response.status,true);
        });
        EmisionVehiculoService.tipos.execute(null,
           function (data) {
               $scope.ambienteVehiculo.tipos = data.tipo_cur;
           }, function (response) {
               mensaje.errorRed('Tipos',response.status,true);
        });
        EmisionVehiculoService.actividadesEconomicas.execute(null,
           function (data) {
               $scope.actividades = data.activ_cur;
           }, function (response) {
               mensaje.errorRed('Actividades',response.status,true);
        });

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
                }
            });
            
            $w1finish.on('click', function (ev) {
                ev.preventDefault();
                var procesado = $scope.ambienteResultado.poliza ? true : false;
                if (!procesado) {
                    var $modalInstance = $modal.open({
                        templateUrl: 'views/emision/vehiculo/confirmar_emision.html',
                        controller: 'EmisionVehiculoConfirmarCtr',
                        scope: $scope
                    });         
                    $modalInstance.result.then(function (result) {
                        if (result)  {
                            EmisionVehiculoService.emisionPoliza.execute({
                                'nnrosolic' : $scope.ambienteCotizaciones.cotizacion.nrosolic
                            }, function (data) {
                                $scope.ambienteResultado.poliza = data.cpoliza;
                                $scope.ambienteResultado.idepol = parseInt(data.nidepol);
                                $scope.ambienteResultado.numcert = parseInt(data.nnumcert);
                                
                                EmisionVehiculoService.cuadroPoliza.execute({
                                    'nidobjeto':$scope.ambienteResultado.idepol,
                                    'nnumcertificado':$scope.ambienteResultado.numcert,
                                    "ctipoobjeto":"POL"
                                }, function(data) {
                                    $scope.ambienteResultado.url = data.url;
                                }, function(response) {
                                    mensaje.errorRed('Generando Poliza',response.status);
                                });
                            },function (response) {
                                mensaje.errorRed('Generando Poliza',response.status);
                            });
                            $state.go('emisionvehiculo.resultado');
                        };
                    });
                } else {
                    $state.go('emisionvehiculo.resultado');
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
                        0 : "emisionvehiculo.cotizaciones",
                        1 : "emisionvehiculo.vehiculo",
                        2 : "emisionvehiculo.cliente",
                        3 : "emisionvehiculo.tomador",
                        4 : "emisionvehiculo.resumen"
                    };
                    $state.go(states[index]);
                },
                onNext: function (tab, navigation, index, newindex) {
                    
                    var validated = false;
                    if (index == 1) {
                        if ($scope.ambienteCotizaciones.cotizacion !== undefined) {
                            validated = true;
                        }  else {
                            mensaje.error("Antes de continuar debe seleccionar una cotización.");                            
                        }
                    } else if (index == 2 ) {
                        validated = $('#w1 form').valid();
                        if ($scope.ambienteVehiculo.vehiculo.valido == false) {
                        mensaje.error("Para poder continuar debe agregar una placa con inspección o una placa de un 0 kms.");
                        }
                        if (!validated || $scope.ambienteVehiculo.vehiculo.valido == false) {
                            $w1validator.focusInvalid();
                            return false;
                        }
                        validated = true;
                    } else if (index == 3 || index == 4) {
                        validated = $('#w1 form').valid();
                        if (!validated) {
                            $w1validator.focusInvalid();
                            return false;
                        };
                    } else if (index == 5){
                            validated = true;                       
                    };

                    if (!validated) {
                        $w1validator.focusInvalid();
                        return false;
                    };

                    switch (index) {
                        case 1:
                            $state.go('emisionvehiculo.vehiculo');
                            break;
                        case 2:
                            EmisionVehiculoService.cotizacionVehiculo.execute({
                                'io_nrosolic' : $scope.ambienteCotizaciones.cotizacion.nrosolic,
                                'i_numplaca': $scope.ambienteVehiculo.vehiculo.placa,
                                'i_serialcarroceria': $scope.ambienteVehiculo.vehiculo.carroceria,  
                                'i_serialmotor': $scope.ambienteVehiculo.vehiculo.motor, 
                                'i_color': $scope.ambienteVehiculo.vehiculo.color, 
                                'i_indcerokm': $scope.ambienteVehiculo.vehiculo.cerokm == true ? 'S' : 'N',
                                'i_fecfact': $scope.ambienteVehiculo.vehiculo.fechaFactura,   
                                'i_uso': $scope.ambienteVehiculo.vehiculo.uso ? $scope.ambienteVehiculo.vehiculo.uso.cod_uso : null
                            }, function (data) {
                                return null;
                            }, function (response) {
                                mensaje.errorRed('Actualizando Datos del Vehículo',response.status);
                            });
                            $state.go('emisionvehiculo.cliente');
                            break;
                        case 3:
                            EmisionVehiculoService.cotizacionSolicitante.execute({
                                'io_nrosolic' : $scope.ambienteCotizaciones.cotizacion.nrosolic,
                                'i_tipoid' : $scope.ambienteCliente.cliente.tipoId.substring(0,1),
                                'i_numid' : $scope.ambienteCliente.cliente.numId,
                                'i_nombre' : $scope.ambienteCliente.cliente.nombre,
                                'i_apellido' : $scope.ambienteCliente.cliente.apellidos,
                                'i_fecnac' : $scope.ambienteCliente.cliente.fechaNacimiento,
                                'i_sexo': $scope.ambienteCliente.cliente.sexo.substring(0,1),
                                'i_edocivil' : $scope.ambienteCliente.cliente.edocivil.substring(0,1),
                                'i_codestado' : $scope.ambienteCliente.cliente.estado.codestado,
                                'i_codciudad' : $scope.ambienteCliente.cliente.ciudad ? $scope.ambienteCliente.cliente.ciudad.codciudad : null,
                                'i_codmunicipio' : $scope.ambienteCliente.cliente.municipio ? $scope.ambienteCliente.cliente.municipio.codmunicipio : null,
                                'i_codurbanizacion' : $scope.ambienteCliente.cliente.urbanizacion ? $scope.ambienteCliente.cliente.urbanizacion.codurbanizacion : null,
                                'i_direccion' : $scope.ambienteCliente.cliente.direccion,
                                'i_email' : $scope.ambienteCliente.cliente.email,
                                'i_profesion' : $scope.ambienteCliente.cliente.profesion ? $scope.ambienteCliente.cliente.profesion.codigo : null,
                                'i_telefono1' : $scope.ambienteCliente.cliente.codArea1.codtelefono + $scope.ambienteCliente.cliente.telefono1.substring(0,3) + $scope.ambienteCliente.cliente.telefono1.substring(4,8),
                                'i_telefono2' : $scope.ambienteCliente.cliente.codArea2.codtelefono + $scope.ambienteCliente.cliente.telefono2.substring(0,3) + $scope.ambienteCliente.cliente.telefono2.substring(4,8)
                            }, function (data) {
                                return null;
                            }, function (response) {
                                mensaje.errorRed('Actualizando Datos del Cliente',response.status);
                            });                           
                            $state.go('emisionvehiculo.tomador');
                            break;
                        case 4:
                            if ($scope.ambienteTomador.tomador.esCliente == 'N') {
                                EmisionVehiculoService.emisionTomador.execute({
                                    'io_nrosolic' : $scope.ambienteCotizaciones.cotizacion.nrosolic,
                                    'i_tipoid' : $scope.ambienteTomador.tomador.tipoId.substring(0,1),
                                    'i_numid' : $scope.ambienteTomador.tomador.numId,
                                    'i_nombre' : $scope.ambienteTomador.tomador.nombre,
                                    'i_apellido' : $scope.ambienteTomador.tomador.apellidos,
                                    'i_fecnac' : $scope.ambienteTomador.tomador.fechaNacimiento,
                                    'i_sexo': $scope.ambienteTomador.tomador.sexo.substring(0,1),
                                    'i_edocivil' : $scope.ambienteTomador.tomador.edocivil.substring(0,1),
                                    'i_codestado' : $scope.ambienteTomador.tomador.estado.codestado,
                                    'i_codciudad' : $scope.ambienteTomador.tomador.ciudad ? $scope.ambienteTomador.tomador.ciudad.codciudad : null,
                                    'i_codmunicipio' : $scope.ambienteTomador.tomador.municipio ? $scope.ambienteTomador.tomador.municipio.codmunicipio : null,
                                    'i_codurbanizacion' : $scope.ambienteTomador.tomador.urbanizacion ? $scope.ambienteTomador.tomador.urbanizacion.codurbanizacion : null,
                                    'i_direccion' : $scope.ambienteTomador.tomador.direccion,
                                    'i_email' : $scope.ambienteTomador.tomador.email,
                                    'i_profesion' : $scope.ambienteTomador.tomador.profesion ? $scope.ambienteTomador.tomador.profesion.codigo : null,
                                    'i_telefono1' : $scope.ambienteTomador.tomador.codArea1.codtelefono + $scope.ambienteTomador.tomador.telefono1.substring(0,3) + $scope.ambienteTomador.tomador.telefono1.substring(4,8),
                                    'i_telefono2' : $scope.ambienteTomador.tomador.codArea2.codtelefono + $scope.ambienteTomador.tomador.telefono2.substring(0,3) + $scope.ambienteTomador.tomador.telefono2.substring(4,8)
                                }, function (data) {
                                    return null;
                                }, function (response) {
                                    mensaje.errorRed('Actualizando Datos del Tomador',response.status);
                                });
                            };
                            EmisionVehiculoService.devuelveCoberturas.execute({
                                'i_nrosolic' : $scope.ambienteCotizaciones.cotizacion.nrosolic
                            }, function (data) {
                                $scope.ambienteCotizaciones.cotizacion.coberturas = data.coberturas_cur;
                                $scope.ambienteCotizaciones.cotizacion.nombre_plan = data.coberturas_cur[0].desc_plan;
                            }, function (response) {
                                mensaje.errorRed('Coberturas de la Cotizacion',response.status);                  
                            });
                            EmisionVehiculoService.devuelvePrima.execute({
                                'i_nrosolic' : $scope.ambienteCotizaciones.cotizacion.nrosolic
                            }, function (data) {
                                $scope.ambienteCotizaciones.cotizacion.prima = data.prima;
                            }, function (response) {
                                mensaje.errorRed('Prima',response.status);                  
                            });
                            $state.go('emisionvehiculo.resumen');
                            break;
                        default:
                            break;
                    };
                },
                onTabClick: function (tab, navigation, index, newindex) {
                    var states = {
                        0 : "emisionvehiculo.cotizaciones",
                        1 : "emisionvehiculo.vehiculo",
                        2 : "emisionvehiculo.cliente",
                        3 : "emisionvehiculo.tomador",
                        4 : "emisionvehiculo.resumen"
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
        
        $state.go("emisionvehiculo.cotizaciones");
    }]);

    emisionVehiculoControllers.controller('EmisionVehiculoConfirmarCtr', ['$scope', 'EmisionVehiculoService', '$state', '$modalInstance', function ($scope, EmisionVehiculoService, $state, $modalInstance) {   
        $scope.emitir = function(){
            $modalInstance.close(true);
        };

        $scope.cancelar = function(){
            $modalInstance.close(false);
        };

    }]);

    emisionVehiculoControllers.controller('EmisionVehiculoCotizacionesCtr', ['$scope', 'EmisionVehiculoService', '$state', '$filter', 'mensaje', 'emitirCotizacion', function ($scope, EmisionVehiculoService, $state, $filter, mensaje, emitirCotizacion) {   
        $scope.$parent.pasoActivo = 0;
  
        if (!$scope.$parent.ambienteCotizaciones.cotizaciones) {
            EmisionVehiculoService.cotizaciones.execute({
                "i_CodUsr": "BMRIVAS"
            }, function (data) {
                var cotizaciones = data.cotizaciones_cur;
                var nro = emitirCotizacion.nro ? emitirCotizacion.nro : undefined;
                var indice = undefined;
                if (nro != undefined) {
                    var cotizacion = {};
                }              
                jQuery.map(cotizaciones,function (cotizacion, i) {
                    cotizaciones[i].prima = parseFloat(cotizacion.prima);
                    if (parseInt(cotizaciones[i].nrosolic) == nro) {
                        indice = i;
                    }
                });

                $scope.$parent.ambienteCotizaciones.cotizaciones = cotizaciones;
                if (indice != undefined) {
                    $scope.seleccionarCotizacion(indice);
                }
            }, function (response) {
                mensaje.errorRed('Cotizaciones',response.status);
            });
        } else {
            $scope.cotizaciones = $scope.$parent.ambienteCotizaciones.cotizaciones;
        }

        $scope.cotizacionSeleccionada = function (indice) {
            var clase = "";
            if (indice == $scope.ambienteCotizaciones.seleccionado) {
                clase = "active";
            }
            return clase;
        };
        
        $scope.seleccionarCotizacion = function (indice) {
            $scope.$parent.ambienteCotizaciones.seleccionado = indice;
            $scope.$parent.ambienteCotizaciones.cotizacion = $scope.ambienteCotizaciones.cotizaciones[indice];
            $scope.$parent.ambienteVehiculo.vehiculo.buscado = false;
            $scope.$parent.ambienteCliente.cliente.buscado = false;
            $(".next").click();
        };
    }]);

    emisionVehiculoControllers.controller('EmisionVehiculoVehiculoCtr', ['$scope', 'EmisionVehiculoService', '$state', 'mensaje', function ($scope, EmisionVehiculoService, $state, mensaje) {
        $scope.$parent.pasoActivo = 1;

        if ($scope.ambienteCotizaciones.cotizacion) {
            if (!$scope.ambienteVehiculo.vehiculo.buscado) {
                EmisionVehiculoService.vehiculos.execute({
                    "i_nrosolic": $scope.ambienteCotizaciones.cotizacion.nrosolic
                }, function (data) {
                    $scope.$parent.ambienteVehiculo.vehiculo = data.vehiculo_cur[0];
                    $scope.$parent.ambienteVehiculo.vehiculo.color = "";
                    $scope.$parent.ambienteVehiculo.vehiculo.cerokm = data.vehiculo_cur[0].indcerokm == 'S' ?  true : false;
                    $scope.$parent.ambienteVehiculo.vehiculo.buscado = true;
                    $scope.$parent.ambienteVehiculo.vehiculo.valido = false;
                }, function (response) {
                    mensaje.errorRed("Vehículo de Cotización",response.status,true);
                });
            }
        } 

        $scope.buscarVehiculo = function () {
            var encontrado = false;
            if (!$scope.$parent.ambienteVehiculo.vehiculo.cerokm) {
                EmisionVehiculoService.validaInspeccion.execute({
                    "cnumplaca" : $scope.$parent.ambienteVehiculo.vehiculo.placa,
                    "ccodmarca" : $scope.$parent.ambienteVehiculo.vehiculo.codmarca,
                    "ccodmodelo" :$scope.$parent.ambienteVehiculo.vehiculo.codmodelo,
                    "nanio" : $scope.$parent.ambienteVehiculo.vehiculo.anoveh
                }, function (data) {
                    if (data.cerror) {
                        mensaje.error(data.cerror);
                        $scope.$parent.ambienteVehiculo.vehiculo.valido = false;
                    } else {
                        $scope.$parent.ambienteVehiculo.vehiculo.valido = true;
                        $scope.$parent.ambienteVehiculo.vehiculo.carroceria = data.cserialdecarroceria;
                        $scope.$parent.ambienteVehiculo.vehiculo.motor = data.cserialdemotor;
                        $scope.$parent.ambienteVehiculo.vehiculo.color = data.ccolor;
                        $scope.$parent.ambienteVehiculo.vehiculo.tipovehiculo = tipoPorId(data.ctipovehiculo);
                        $scope.$parent.ambienteVehiculo.vehiculo.uso = usoPorId(data.cuso);
                    }
    	        }, function (response) {
		    mensaje.errorRed('Inspección',response.status,true);
	        });
            };
        };

        function usoPorId(id) {
            for (var i = 0; i < $scope.$parent.ambienteVehiculo.usos.length; i++) {
                if ($scope.$parent.ambienteVehiculo.usos[i].codigo_uso == id) {
                    return $scope.$parent.ambienteVehiculo.usos[i];
                };
            };
        };

        function tipoPorId(id) {
            for (var i = 0; i < $scope.$parent.ambienteVehiculo.tipos.length; i++) {
                if ($scope.$parent.ambienteVehiculo.tipos[i].codigo == id) {
                    return $scope.$parent.ambienteVehiculo.tipos[i];
                };
            };
        };
    }]);

    emisionVehiculoControllers.controller('EmisionVehiculoClienteCtr', ['$scope', 'EmisionVehiculoService', '$state', 'mensaje', function ($scope, EmisionVehiculoService, $state, mensaje) {
        $('#date').mask("99/99/9999");
        $('.phone').mask("999-9999");

        $scope.$parent.pasoActivo = 2;

        if ($scope.ambienteCotizaciones.cotizacion) {
            if (!$scope.ambienteCliente.cliente.buscado) {
                EmisionVehiculoService.solicitantes.execute({
                    "i_nrosolic": $scope.ambienteCotizaciones.cotizacion.nrosolic
                }, function (data) {
                    $scope.$parent.ambienteCliente.cliente.telefonos = [];
                    $scope.$parent.ambienteCliente.cliente.tipoId = tipoIdPorInicial(data.solicitante_cur[0].tipoid);
                    $scope.$parent.ambienteCliente.cliente.numId = data.solicitante_cur[0].numid;

                    $scope.$parent.ambienteCliente.cliente.nombre = data.solicitante_cur[0].nombre;
                    $scope.$parent.ambienteCliente.cliente.apellidos = data.solicitante_cur[0].apellido;
                    $scope.$parent.ambienteCliente.cliente.fechaNacimiento = data.solicitante_cur[0].fecnac;
                    $scope.$parent.ambienteCliente.cliente.sexo = sexoPorInicial(data.solicitante_cur[0].sexo);
                    $scope.$parent.ambienteCliente.cliente.edocivil = edoCivilPorInicial(data.solicitante_cur[0].edocivil);
                    $scope.$parent.ambienteCliente.cliente.estado = estadoPorID(data.solicitante_cur[0].codestado);
                    $scope.$parent.ambienteCliente.cliente.ciudad = ciudadPorID(data.solicitante_cur[0].codestado,data.solicitante_cur[0].codciudad);
                    $scope.$parent.ambienteCliente.cliente.municipio = municipioPorID(data.solicitante_cur[0].codestado,data.solicitante_cur[0].codciudad,data.solicitante_cur[0].codmunicipio);
                    $scope.$parent.ambienteCliente.cliente.urbanizacion = urbanizacionPorID(data.solicitante_cur[0].codestado,data.solicitante_cur[0].codciudad,data.solicitante_cur[0].codmunicipio,data.solicitante_cur[0].codurbanizacion);
                    
                    $scope.$parent.ambienteCliente.cliente.direccion = data.solicitante_cur[0].direccion;                        
                    $scope.$parent.ambienteCliente.cliente.email = data.solicitante_cur[0].email;
                    $scope.$parent.ambienteCliente.cliente.profesion = profesionPorCod(data.solicitante_cur[0].profesion);
                    $scope.$parent.ambienteCliente.cliente.acsel = data.solicitante_cur[0].acsel == "1" ? true : false;

                    $scope.$parent.ambienteCliente.cliente.telefonos[0] = data.solicitante_cur[0].telefono1;
                    $scope.$parent.ambienteCliente.cliente.telefonos[1] = data.solicitante_cur[0].telefono2;                        
                    $scope.$parent.ambienteTomador.tomador.esCliente = 'S';
                    iniciarTelefonos();
                    $scope.$parent.ambienteCliente.cliente.buscado = true;               
                    
                }, function (response) {
                    mensaje.errorRed("Solicitante de Cotización",response.status,true);
                });
                
            };
        };

        function iniciarTelefonos () {
            var telefono1 = $scope.$parent.ambienteCliente.cliente.telefonos[0];
            var telefono2 = $scope.$parent.ambienteCliente.cliente.telefonos[1];
            var numberRex = /(\d{3,4})(\d{7})/;
            
            if (telefono1) {
                telefono1 = telefono1.match(numberRex);
                if (telefono1) {
                    if (telefono1[1].length == 3) {
                        $scope.ambienteCliente.cliente.codArea1 = codAreasPorCod("0" + telefono1[1]);
                    } else {
                        $scope.ambienteCliente.cliente.codArea1 = codAreasPorCod(telefono1[1]);
                    }
                    $scope.ambienteCliente.cliente.telefono1 = telefono1[2].substring(0,3)+"-"+telefono1[2].substring(3,7);
                }
            }
            
            if (telefono2) {
                telefono2 = telefono2.match(numberRex);
                if (telefono2) {
                    if (telefono2[1].length == 3) {
                        $scope.ambienteCliente.cliente.codArea2 = codAreasPorCod("0" + telefono2[1]);
                    } else {
                        $scope.ambienteCliente.cliente.codArea2 = codAreasPorCod(telefono2[1]);
                    }
                    $scope.ambienteCliente.cliente.telefono2 = telefono2[2].substring(0,3)+"-"+telefono2[2].substring(3,7);
                    
                }
            }
        };

        $scope.cambioEstado = function (){
            $scope.ambienteCliente.cliente.ciudad = undefined;
            $scope.ambienteCliente.cliente.municipio = undefined;
            $scope.ambienteCliente.cliente.urbanizacion = undefined;
        };
        
        $scope.cambioCiudad = function (){
            $scope.ambienteCliente.cliente.municipio = undefined;
            $scope.ambienteCliente.cliente.urbanizacion = undefined;
        };

        $scope.cambioMunicipio = function (){
            $scope.ambienteCliente.cliente.urbanizacion = undefined;
        };

        $scope.buscarAsegurado = function () {
            EmisionVehiculoService.tercero.execute({
                'p_tipoid': $scope.$parent.ambienteCliente.cliente.tipoId.substring(0,1), 'p_numid': parseInt($scope.ambienteCliente.cliente.numId),
                'p_dvid': '0'
            }, function (asegurado) {
                if (asegurado.c_solicitante.length){                    
                    $scope.$parent.ambienteCliente.cliente.telefonos = [];
                    $scope.$parent.ambienteCliente.cliente.nombre = asegurado.c_solicitante[0].nomter;
                    $scope.$parent.ambienteCliente.cliente.apellidos = asegurado.c_solicitante[0].apeter;
                    $scope.$parent.ambienteCliente.cliente.fechaNacimiento = asegurado.c_solicitante[0].fecnac;
                    $scope.$parent.ambienteCliente.cliente.sexo = sexoPorInicial(asegurado.c_solicitante[0].sexo);
                    $scope.$parent.ambienteCliente.cliente.edocivil = edoCivilPorInicial(asegurado.c_solicitante[0].edocivil);
                    $scope.$parent.ambienteCliente.cliente.estado = estadoPorID(asegurado.c_solicitante[0].codestado);
                    $scope.$parent.ambienteCliente.cliente.ciudad = ciudadPorID(asegurado.c_solicitante[0].codestado,asegurado.c_solicitante[0].codciudad);
                    $scope.$parent.ambienteCliente.cliente.municipio = municipioPorID(asegurado.c_solicitante[0].codestado,asegurado.c_solicitante[0].codciudad,asegurado.c_solicitante[0].codmunicipio);
                    $scope.$parent.ambienteCliente.cliente.urbanizacion = urbanizacionPorID(asegurado.c_solicitante[0].codestado,asegurado.c_solicitante[0].codciudad,asegurado.c_solicitante[0].codmunicipio,asegurado.c_solicitante[0].codurbanizacion);
                    
                    $scope.$parent.ambienteCliente.cliente.direccion = asegurado.c_solicitante[0].direc;                        
                    $scope.$parent.ambienteCliente.cliente.email = asegurado.c_solicitante[0].email;
                    $scope.$parent.ambienteCliente.cliente.profesion = profesionPorCod(asegurado.c_solicitante[0].codact);
                    
                    $scope.$parent.ambienteCliente.cliente.buscado = true;
                    $scope.$parent.ambienteCliente.cliente.acsel = true;
                    
                    $scope.$parent.ambienteCliente.cliente.telefonos[0] = asegurado.c_solicitante[0].telef1;
                    $scope.$parent.ambienteCliente.cliente.telefonos[1] = asegurado.c_solicitante[0].telef2;
                    $scope.$parent.ambienteTomador.tomador.esCliente = 'S'; 
                    iniciarTelefonos();
                    
                } else {
                    var numId = $scope.$parent.ambienteCliente.cliente.numId;
                    $scope.iniciarFormulario();
                    $scope.$parent.ambienteCliente.cliente.numId = numId;
                    $scope.$parent.ambienteCliente.cliente.buscado = true;
                    $scope.$parent.ambienteCliente.cliente.acsel = false;
                }
	    },function (response) {
		mensaje.errorRed('Personas',response.status,true);
	    });
        };

        function estadoPorID(id) {
            for (var estado = 0; estado < $scope.$parent.estados.length; estado++) {
                if ($scope.estados[estado].codestado == id) {
                    return $scope.estados[estado];
                }
            }
        };

        function ciudadPorID(idestado, idciudad) {
            for (var ciudad = 0; ciudad < $scope.$parent.ciudades.length; ciudad++) {
                if (($scope.ciudades[ciudad].codestado == idestado) && ($scope.ciudades[ciudad].codciudad == idciudad)) {
                    return $scope.ciudades[ciudad];
                }
            }
        };

        function municipioPorID(idestado, idciudad, idmunicipio) {
            for (var municipio = 0; municipio < $scope.$parent.municipios.length; municipio++) {
                if (($scope.municipios[municipio].codestado == idestado) && ($scope.municipios[municipio].codciudad == idciudad) && ($scope.municipios[municipio].codmunicipio == idmunicipio)) {
                    return $scope.municipios[municipio];
                }
            }
        };

        function urbanizacionPorID(idestado, idciudad, idmunicipio, idurbanizacion) {
            for (var urbanizacion = 0; urbanizacion < $scope.$parent.urbanizaciones.length; urbanizacion++) {
                if (($scope.urbanizaciones[urbanizacion].codestado == idestado) && ($scope.urbanizaciones[urbanizacion].codciudad == idciudad) && ($scope.urbanizaciones[urbanizacion].codmunicipio == idmunicipio) && ($scope.urbanizaciones[urbanizacion].codurbanizacion == idurbanizacion)) {
                    return $scope.urbanizaciones[urbanizacion];
                }
            }
        };

        function tipoIdPorInicial(inicial) {
            for (var tipoId = 0; tipoId < $scope.$parent.tiposId.length; tipoId++) {
                if ($scope.$parent.tiposId[tipoId].substring(0,1) == inicial) {
                    return $scope.$parent.tiposId[tipoId];
                }
            }
        };

        function edoCivilPorInicial(inicial) {
            for (var edoCivil = 0; edoCivil < $scope.$parent.edosCivil.length; edoCivil++) {
                if ($scope.$parent.edosCivil[edoCivil].substring(0,1) == inicial) {
                    return $scope.$parent.edosCivil[edoCivil];
                }
            }
        };

        function sexoPorInicial(inicial) {
            for (var i = 0; i < $scope.$parent.sexos.length; i++) {
                if ($scope.$parent.sexos[i].substring(0,1) == inicial) {
                    return $scope.$parent.sexos[i];
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

        function profesionPorCod(code) {
            for (var codigo = 0; codigo < $scope.actividades.length; codigo++) {
                if ($scope.actividades[codigo].codigo == code) {
                    return $scope.actividades[codigo];
                }	
            }
        };

        $scope.iniciarFormulario = function () {
            $scope.userexists = false;
            $scope.$parent.ambienteCliente.cliente.nombre = "";
            $scope.$parent.ambienteCliente.cliente.apellidos = "";
            $scope.$parent.ambienteCliente.cliente.fechaNacimiento = "";
            $scope.$parent.ambienteCliente.cliente.sexo = undefined;
            $scope.$parent.ambienteCliente.cliente.edocivil = undefined;
            $scope.$parent.ambienteCliente.cliente.estado = undefined;
            $scope.$parent.ambienteCliente.cliente.ciudad = undefined;
            $scope.$parent.ambienteCliente.cliente.municipio = undefined;
            $scope.$parent.ambienteCliente.cliente.urbanizacion = undefined;
            $scope.$parent.ambienteCliente.cliente.direccion = "";
            $scope.$parent.ambienteCliente.cliente.codArea1 = undefined;
            $scope.$parent.ambienteCliente.cliente.codArea2 = undefined;
            $scope.$parent.ambienteCliente.cliente.telefono1 = "";
            $scope.$parent.ambienteCliente.cliente.telefono2 = "";
            $scope.$parent.ambienteCliente.cliente.profesion = "";
            $scope.$parent.ambienteCliente.cliente.email = "";
            $scope.$parent.ambienteCliente.cliente.buscado = true;
        };
    }]);

    emisionVehiculoControllers.controller('EmisionVehiculoTomadorCtr', ['$scope', 'EmisionVehiculoService', '$state', 'mensaje', function ($scope, EmisionVehiculoService, $state, mensaje) {
        $scope.$parent.pasoActivo = 3;
        $('#date').mask("99/99/9999");
        $('.phone').mask("999-9999");

        $scope.tomadorEsCliente = function () {
            $scope.$parent.ambienteTomador.tomador.tipoId = $scope.$parent.ambienteCliente.cliente.tipoId;
            $scope.$parent.ambienteTomador.tomador.numId = $scope.$parent.ambienteCliente.cliente.numId;

            $scope.$parent.ambienteTomador.tomador.nombre = $scope.$parent.ambienteCliente.cliente.nombre;
            $scope.$parent.ambienteTomador.tomador.apellidos = $scope.$parent.ambienteCliente.cliente.apellidos;
            $scope.$parent.ambienteTomador.tomador.fechaNacimiento = $scope.$parent.ambienteCliente.cliente.fechaNacimiento;
            $scope.$parent.ambienteTomador.tomador.sexo = $scope.$parent.ambienteCliente.cliente.sexo;
            $scope.$parent.ambienteTomador.tomador.edocivil = $scope.$parent.ambienteCliente.cliente.edocivil;
            $scope.$parent.ambienteTomador.tomador.estado = $scope.$parent.ambienteCliente.cliente.estado;
            $scope.$parent.ambienteTomador.tomador.ciudad = $scope.$parent.ambienteCliente.cliente.ciudad;
            $scope.$parent.ambienteTomador.tomador.municipio = $scope.$parent.ambienteCliente.cliente.municipio;
            $scope.$parent.ambienteTomador.tomador.urbanizacion = $scope.$parent.ambienteCliente.cliente.urbanizacion;
            
            $scope.$parent.ambienteTomador.tomador.direccion = $scope.$parent.ambienteCliente.cliente.direccion;                        
            $scope.$parent.ambienteTomador.tomador.email = $scope.$parent.ambienteCliente.cliente.email;
            $scope.$parent.ambienteTomador.tomador.profesion = $scope.$parent.ambienteCliente.cliente.profesion;
            $scope.ambienteTomador.tomador.codArea1  = $scope.ambienteCliente.cliente.codArea1;
            $scope.ambienteTomador.tomador.codArea2  = $scope.ambienteCliente.cliente.codArea1;
            $scope.ambienteTomador.tomador.telefono1  = $scope.ambienteCliente.cliente.telefono1;
            $scope.ambienteTomador.tomador.telefono2  = $scope.ambienteCliente.cliente.telefono2;
            $scope.$parent.ambienteTomador.tomador.buscado = true;
        };
        
        $scope.tomadorNoCliente = function () {
            $scope.iniciarFormulario();
        };
        
        if ($scope.ambienteTomador.tomador.esCliente == 'S' || $scope.ambienteTomador.tomador.numId === undefined) {
            $scope.tomadorEsCliente();
        }

        $scope.verificarCedula = function () {
            if (($scope.$parent.ambienteCliente.cliente.numId == $scope.$parent.ambienteTomador.tomador.numId) && ($scope.$parent.ambienteCliente.cliente.tipoId == $scope.$parent.ambienteTomador.tomador.tipoId)) {
                $scope.tomadorEsCliente();
                $scope.$parent.ambienteTomador.tomador.esCliente = 'S';
            } else {
                $scope.buscarAsegurado();
            }
        };

        function iniciarTelefonos () {
            var telefono1 = $scope.$parent.ambienteTomador.tomador.telefonos[0];
            var telefono2 = $scope.$parent.ambienteTomador.tomador.telefonos[1];
            var numberRex = /(\d{3,4})(\d{7})/;
            
            if (telefono1) {
                telefono1 = telefono1.match(numberRex);
                if (telefono1) {
                    if (telefono1[1].length == 3) {
                        $scope.ambienteTomador.tomador.codArea1 = codAreasPorCod("0" + telefono1[1]);
                    } else {
                        $scope.ambienteTomador.tomador.codArea1 = codAreasPorCod(telefono1[1]);
                    }
                    $scope.ambienteTomador.tomador.telefono1 = telefono1[2].substring(0,3)+"-"+telefono1[2].substring(3,7);
                }
            }
            
            if (telefono2) {
                telefono2 = telefono2.match(numberRex);
                if (telefono2) {
                    if (telefono2[1].length == 3) {
                        $scope.ambienteTomador.tomador.codArea2 = codAreasPorCod("0" + telefono2[1]);
                    } else {
                        $scope.ambienteTomador.tomador.codArea2 = codAreasPorCod(telefono2[1]);
                    }
                    $scope.ambienteTomador.tomador.telefono2 = telefono2[2].substring(0,3)+"-"+telefono2[2].substring(3,7);
                    
                }
            }
        };

        $scope.cambioEstado = function (){
            $scope.ambienteTomador.tomador.ciudad = undefined;
            $scope.ambienteTomador.tomador.municipio = undefined;
            $scope.ambienteTomador.tomador.urbanizacion = undefined;
        };
        
        $scope.cambioCiudad = function (){
            $scope.ambienteTomador.tomador.municipio = undefined;
            $scope.ambienteTomador.tomador.urbanizacion = undefined;
        };

        $scope.cambioMunicipio = function (){
            $scope.ambienteTomador.tomador.urbanizacion = undefined;
        };

        $scope.buscarAsegurado = function () {
            EmisionVehiculoService.tercero.execute({
                'p_tipoid': $scope.$parent.ambienteTomador.tomador.tipoId.substring(0,1), 'p_numid': parseInt($scope.ambienteTomador.tomador.numId),
                'p_dvid': '0'
            }, function (asegurado) {
                if (asegurado.c_solicitante.length){                    
                    $scope.$parent.ambienteTomador.tomador.telefonos = [];
                    $scope.$parent.ambienteTomador.tomador.nombre = asegurado.c_solicitante[0].nomter;
                    $scope.$parent.ambienteTomador.tomador.apellidos = asegurado.c_solicitante[0].apeter;
                    $scope.$parent.ambienteTomador.tomador.fechaNacimiento = asegurado.c_solicitante[0].fecnac;
                    $scope.$parent.ambienteTomador.tomador.sexo = sexoPorInicial(asegurado.c_solicitante[0].sexo);
                    $scope.$parent.ambienteTomador.tomador.edocivil = edoCivilPorInicial(asegurado.c_solicitante[0].edocivil);
                    $scope.$parent.ambienteTomador.tomador.estado = estadoPorID(asegurado.c_solicitante[0].codestado);
                    $scope.$parent.ambienteTomador.tomador.ciudad = ciudadPorID(asegurado.c_solicitante[0].codestado,asegurado.c_solicitante[0].codciudad);
                    $scope.$parent.ambienteTomador.tomador.municipio = municipioPorID(asegurado.c_solicitante[0].codestado,asegurado.c_solicitante[0].codciudad,asegurado.c_solicitante[0].codmunicipio);
                    $scope.$parent.ambienteTomador.tomador.urbanizacion = urbanizacionPorID(asegurado.c_solicitante[0].codestado,asegurado.c_solicitante[0].codciudad,asegurado.c_solicitante[0].codmunicipio,asegurado.c_solicitante[0].codurbanizacion);
                    
                    $scope.$parent.ambienteTomador.tomador.direccion = asegurado.c_solicitante[0].direc;                        
                    $scope.$parent.ambienteTomador.tomador.email = asegurado.c_solicitante[0].email;
                    $scope.$parent.ambienteTomador.tomador.profesion = profesionPorCod(asegurado.c_solicitante[0].codact);
                    
                    $scope.$parent.ambienteTomador.tomador.buscado = true;
                    $scope.$parent.ambienteTomador.tomador.acsel = true;
                    
                    $scope.$parent.ambienteTomador.tomador.telefonos[0] = asegurado.c_solicitante[0].telef1;
                    $scope.$parent.ambienteTomador.tomador.telefonos[1] = asegurado.c_solicitante[0].telef2; 
                    iniciarTelefonos();
                    
                } else {
                    var numId = $scope.$parent.ambienteTomador.tomador.numId;
                    $scope.iniciarFormulario();
                    $scope.$parent.ambienteTomador.tomador.numId = numId;
                    $scope.$parent.ambienteTomador.tomador.buscado = true;
                    $scope.$parent.ambienteTomador.tomador.acsel = false;
                }
	    },function (response) {
		mensaje.errorRed('Personas',response.status,true);
	    })
        };

        function estadoPorID(id) {
            for (var estado = 0; estado < $scope.$parent.estados.length; estado++) {
                if ($scope.estados[estado].codestado == id) {
                    return $scope.estados[estado];
                }
            }
        };

        function ciudadPorID(idestado, idciudad) {
            for (var ciudad = 0; ciudad < $scope.$parent.ciudades.length; ciudad++) {
                if (($scope.ciudades[ciudad].codestado == idestado) && ($scope.ciudades[ciudad].codciudad == idciudad)) {
                    return $scope.ciudades[ciudad];
                }
            }
        };

        function municipioPorID(idestado, idciudad, idmunicipio) {
            for (var municipio = 0; municipio < $scope.$parent.municipios.length; municipio++) {
                if (($scope.municipios[municipio].codestado == idestado) && ($scope.municipios[municipio].codciudad == idciudad) && ($scope.municipios[municipio].codmunicipio == idmunicipio)) {
                    return $scope.municipios[municipio];
                }
            }
        };

        function urbanizacionPorID(idestado, idciudad, idmunicipio, idurbanizacion) {
            for (var urbanizacion = 0; urbanizacion < $scope.$parent.urbanizaciones.length; urbanizacion++) {
                if (($scope.urbanizaciones[urbanizacion].codestado == idestado) && ($scope.urbanizaciones[urbanizacion].codciudad == idciudad) && ($scope.urbanizaciones[urbanizacion].codmunicipio == idmunicipio) && ($scope.urbanizaciones[urbanizacion].codurbanizacion == idurbanizacion)) {
                    return $scope.urbanizaciones[urbanizacion];
                }
            }
        };

        function tipoIdPorInicial(inicial) {
            for (var tipoId = 0; tipoId < $scope.$parent.tiposId.length; tipoId++) {
                if ($scope.$parent.tiposId[tipoId].substring(0,1) == inicial) {
                    return $scope.$parent.tiposId[tipoId];
                }
            }
        };

        function edoCivilPorInicial(inicial) {
            for (var edoCivil = 0; edoCivil < $scope.$parent.edosCivil.length; edoCivil++) {
                if ($scope.$parent.edosCivil[edoCivil].substring(0,1) == inicial) {
                    return $scope.$parent.edosCivil[edoCivil];
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

        function profesionPorCod(code) {
            for (var codigo = 0; codigo < $scope.actividades.length; codigo++) {
                if ($scope.actividades[codigo].codigo == code) {
                    return $scope.actividades[codigo];
                }	
            }
        };

        function sexoPorInicial(inicial) {
            for (var i = 0; i < $scope.$parent.sexos.length; i++) {
                if ($scope.$parent.sexos[i].substring(0,1) == inicial) {
                    return $scope.$parent.sexos[i];
                }
            }
        };

        $scope.iniciarFormulario = function () {
            $scope.userexists = false;
            $scope.$parent.ambienteTomador.tomador.numId = "";
            $scope.$parent.ambienteTomador.tomador.nombre = "";
            $scope.$parent.ambienteTomador.tomador.apellidos = "";
            $scope.$parent.ambienteTomador.tomador.fechaNacimiento = "";
            $scope.$parent.ambienteTomador.tomador.sexo = undefined;
            $scope.$parent.ambienteTomador.tomador.edocivil = "";
            $scope.$parent.ambienteTomador.tomador.estado = undefined;
            $scope.$parent.ambienteTomador.tomador.ciudad = undefined;
            $scope.$parent.ambienteTomador.tomador.municipio = undefined;
            $scope.$parent.ambienteTomador.tomador.urbanizacion = undefined;
            $scope.$parent.ambienteTomador.tomador.direccion = "";
            $scope.$parent.ambienteTomador.tomador.codArea1 = "";
            $scope.$parent.ambienteTomador.tomador.codArea2 = "";
            $scope.$parent.ambienteTomador.tomador.telefono1 = "";
            $scope.$parent.ambienteTomador.tomador.telefono2 = "";
            $scope.$parent.ambienteTomador.tomador.profesion = "";
            $scope.$parent.ambienteTomador.tomador.email = "";
            $scope.$parent.ambienteTomador.tomador.buscado = true;
            $scope.$parent.ambienteTomador.tomador.acsel = false;
        };
    }]);

    emisionVehiculoControllers.controller('EmisionVehiculoResumenCtr', ['$scope', 'EmisionVehiculoService', '$state', 'mensaje', function ($scope, EmisionVehiculoService, $state, mensaje) {
        $scope.$parent.pasoActivo = 4;
    }]);

    emisionVehiculoControllers.controller('EmisionVehiculoResultadoCtr', ['$scope', 'EmisionVehiculoService', '$state', 'mensaje', function ($scope, EmisionVehiculoService, $state, mensaje) {
        $scope.$parent.pasoActivo = 5;
    }]);
});