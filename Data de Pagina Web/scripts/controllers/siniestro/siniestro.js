define(['angular'], function (angular) {
    'use strict';
    var siniestroControllers = angular.module('siniestroControllers', []);

    siniestroControllers.controller('SiniestroWizardCtr', ['$scope','$state', 'mensaje','SiniestroService',
        function($scope, $state, mensaje, SiniestroService){
            $scope.ambienteVehiculo = {
                datosBusqueda: {
                    tipoId: "Venezolano"
                }
            };

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
                        required: true
                    },
                    telefono:{
                        required: true
                    },
                    celular:{
                        required: true
                    },
                    
                },
                messages: {
                }
            });

            $w1finish.on('click', function (ev) {
                ev.preventDefault();
                var validated = $('#w1 form').valid();
                if (validated) {
                    console.log('finish siniestro');
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
                        0 : "siniestro.vehiculo",
                        1 : "siniestro.titular",
                        2 : "siniestro.conductor",
                        3 : "siniestro.danos",
                        4 : "siniestro.taller",
                        5 : "siniestro.resumen",
                    }
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
                                SiniestroService.obtenerPoliza.execute({
                                    'nidepol': $scope.ambienteVehiculo.polizaSeleccionada.idepol
                                },function(response){
                                    $scope.ambienteVehiculo.detallePoliza = response;
                                    $state.go('siniestro.titular');
                                },function(){
                                    mensaje.error('Error obteniendo detalle de Póliza', true);
                                    return false;
                                });
                            }
                            break;
                        case 2:
                            $state.go('siniestro.conductor');
                            break;
                        case 3:
                            $state.go('siniestro.danos');
                            break;
                        case 4:
                            $state.go('siniestro.taller');
                            break;
                        case 5:
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
                        4 : "siniestro.taller",
                        5 : "siniestro.resumen",
                    }
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

            $state.go('siniestro.vehiculo');
    }]);

    siniestroControllers.controller('SiniestroVehiculoCtr', ['$scope','mensaje','SiniestroService',
        function($scope, mensaje, SiniestroService){
            $('#date').mask("99/99/9999"); //TODO: hacer directiva para esto

            $scope.tiposId = ['Venezolano', 'Extranjero', 'Pasaporte', 'Jurídico', 'Gubernamental'];

            $scope.formatoFechas = function() {
                angular.forEach($scope.ambienteVehiculo.polizas, function(value, key){
                    var fechIni = value.fecinivig;
                    var fechFin = value.fecfinvig;
                    value.fecinivig = Date.parse(fechIni);
                    value.fecfinvig = Date.parse(fechFin);
                });
            };

            $scope.obtenerVehiculos = function () {
                if($scope.form.valid()){
                    var datos = $scope.ambienteVehiculo.datosBusqueda;
                    SiniestroService.obtenerPolizas.execute({
                        'cNumPlaca': datos.placa ? datos.placa : null,
                        'cFechaOcurr': datos.fechaSiniestro,
                        'cCedula': datos.cedula ? datos.cedula : null,
                        'nNumPol': datos.poliza ? datos.poliza : null,
                    }, function(response){
                        $scope.ambienteVehiculo.polizaSeleccionada = undefined;
                        $scope.$parent.ambienteVehiculo.polizas = response.poliza_siniestro_cur;
                        $scope.formatoFechas();
                    }, function(response){
                        mensaje.info("No existen pólizas asociadas a estos datos");
                        $scope.ambienteVehiculo.polizas = undefined;
                    });
                }
            };

            $scope.limpiarDatos = function(){
                $scope.$parent.ambienteVehiculo.datosBusqueda.cedula = undefined;
                $scope.$parent.ambienteVehiculo.datosBusqueda.poliza = undefined;
                $scope.$parent.ambienteVehiculo.datosBusqueda.placa = undefined;
            }

            $scope.seleccionarPoliza = function(poliza) {
                $scope.$parent.ambienteVehiculo.polizaSeleccionada = poliza;
            };
    }]);

    siniestroControllers.controller('SiniestroTitularCtr', ['$scope',
        function($scope){
            //$('.phone').mask("999?9-9999999");
            console.log('titular');
    }]);

    siniestroControllers.controller('SiniestroConductorCtr', ['$scope',
        function($scope){
            console.log('conductor');
    }]);

    siniestroControllers.controller('SiniestroDanosCtr', ['$scope',
        function($scope){
            console.log('danos');
    }]);

    siniestroControllers.controller('SiniestroTallerCtr', ['$scope',
        function($scope){
            console.log('taller');
    }]);

    siniestroControllers.controller('SiniestroResumenCtr', ['$scope',
        function($scope){
            console.log('resumen');
    }]);
});
