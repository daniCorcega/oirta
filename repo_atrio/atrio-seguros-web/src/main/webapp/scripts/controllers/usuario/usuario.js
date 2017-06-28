define(['angular'], function (angular) {
    'use strict';
    var usuarioControllers = angular.module('usuarioControllers', []);

    //usuarioControllers.controller('usuarioCambiarClaveCtr', ['$scope', 'UsuarioService', '$http','mensaje', '$state', '$timeout',
    usuarioControllers.controller('usuarioCambiarClaveCtr', ['$scope', 'UsuarioService', '$http','mensaje', '$state', '$timeout',
        function($scope, UsuarioService, $http, mensaje, $state, $timeout){
            $scope.claveActual = "";
            $scope.claveNueva = "";
            $scope.claveConfirma = "";
            $scope.habilitado = true;

            $scope.claveActualOk = function () {
                var ok = false;
                if ($scope.claveActual.length >= 6 && $scope.claveActual != $scope.claveNueva) {
                  ok = true;
                };
                return ok;
            };

            $scope.claveNuevaOk = function () {
                var ok = false;
                if ($scope.claveNueva.length >= 6 && $scope.claveNueva != $scope.claveActual) {
                    ok = true;
                };
                return ok;
            };

            $scope.claveConfirmaOk = function () {
                var ok = false;
                if ($scope.claveConfirma.length >= 6 && $scope.claveNueva == $scope.claveConfirma && $scope.claveNueva != $scope.claveActual) {
                   ok = true;
                };
                return ok;
            };

            $scope.cambiarNoOk = function() {
                var ok = false;
                if ($scope.habilitado && $scope.claveActualOk() && $scope.claveNuevaOk() && $scope.claveConfirmaOk()) {

                    ok = true;
                }
                return !(ok);
            };

          /*  UserService.usuarioActual.execute({
            },function (data) {
                $scope.usuario = data;
            }, function (response) {
                mensaje.errorRed('Cargando Usuario',response.status);
            });
*/
            $scope.enviar = function(){
                $scope.habilitado = false;
                UsuarioService.cambiarClave.execute({
                    oldPassword : $scope.claveActual,
                    newPassword : $scope.claveNueva,
                    confirmPassword : $scope.claveConfirma
                },function (data) {
                    if (data.error != null) {
                        mensaje.error("Posiblemente usted introdujo mal la clave actual, la clave nueva o la confimación de la misma. Por favor, verifique los datos.");
                        $scope.claveActual = "";
                        $scope.claveNueva = "";
                        $scope.claveConfirma = "";
                        $scope.habilitado = true;
                    } else {
                        mensaje.exito("Se ha cambiado la clave con éxito. Debe volver a iniciar sesión, así que será redirigido a la pagina de inicio en unos segundos.");
                        $timeout(function () {
                            location.reload();
                        }, 5000);
                    }
                }, function (response) {
                    $scope.habilitado = true;
                    $scope.claveActual = "";
                    $scope.claveNueva = "";
                    $scope.claveConfirma = "";
                    mensaje.error("Posiblemente usted introdujo mal la clave actual, la clave nueva o la confimación de la misma. Por favor, verifique los datos.");
                });

              //$scope.datos = [{
                //    prusu : {
                  //     password : $scope.claveNueva,
                    //   id : $scope.usuario.id
                    //},
                  //  pvie  : {
                    //   password : $scope.claveActual,
                      // id : $scope.usuario.id
                  //  }
              //  }]

                //for(var i = 0; i < $scope.datos.length; i++){
                  //var data = $scope.datos[i];
                //}
                /*UserService.cifrarcontraseña.execute({
                    'p_password' : $scope.claveNueva
                },function (result) {
                    $scope.cifradonue = result.result;
                UserService.cifrarcontraseña.execute({
                    'p_password' : $scope.claveActual,
                },function (data) {
                    $scope.cifradovie = data.result;
                UserService.cambiarcontraseña.execute({
                    'nidusuario' : $scope.usuario.id,
                    'cclavenue' : $scope.cifradonue,
                    'cclavevie' : $scope.cifradovie
                },function (data) {
                    if (data.nerror != 0) {
                        //mensaje.nerror("Posiblemente usted introdujo mal la clave actual, la clave nueva o la confimación de la misma. Por favor, verifique los datos.");
                        mensaje.error(data.cmensaje);
                        $scope.claveActual = "";
                        $scope.claveNueva = "";
                        $scope.claveConfirma = "";
                        //$scope.habilitado = true;
                    } else {
                      mensaje.exito(data.cmensaje || "Se ha actualizado su contraseña, en breves segundos sera enviando a la pantalla de inicio");
                      //$timeout(function () {
                        //    location.reload();
                          //  $state.go('home');
                        //}, 2000);

                    }
                }, function (response) {
                    //$scope.habilitado = true;
                    //$scope.claveActual = "";
                    //$scope.claveNueva = "";
                    //$scope.claveConfirma = "";
                    mensaje.error(data.nerror);
                  },function (response){
                    mensaje.errorRed('Cifrando Contraseña nueva',response.status);
                  });
                  },function (response){
                    mensaje.errorRed('Cifrando Contraseña vieja',response.status);
                  });
                });*/
            };

            }]);

usuarioControllers.controller('usuarioActualizarCtr', ['$scope', 'UserService', '$http','mensaje', '$state', '$timeout',
                function($scope, UserService, $http, mensaje, $state, $timeout){

                  $scope.nombre = "";
                  $scope.email = "";
                  $scope.telefono = "";

                  $scope.nombrenew = function () {
                      var ok = false;
                      if ($scope.nombre.length >= 6) {
                        ok = true;
                      };
                      return ok;
                  };

                  $scope.emailnew = function () {
                      var ok = false;
                      if ($scope.email.length >= 6) {
                          ok = true;
                      };
                      return ok;
                  };

                  $scope.telefononew = function () {
                      var ok = false;
                      if ($scope.telefono.length >=6) {
                          ok = true;
                      };
                      return ok;
                  }
        }]);
});
