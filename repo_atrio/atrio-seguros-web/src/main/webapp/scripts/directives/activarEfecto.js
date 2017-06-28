define(['angular'], function (ng) {
 'use strict';
    var EfectoDirectives = ng.module('efectoDirectives', []);

    EfectoDirectives.directive('activarEfecto', function () {
    return {
        restrict: 'A',
        link: function(scope, el, attr) {
            var funct = window[attr.efecto];
            funct(jQuery);
        }
   };

  });



    EfectoDirectives.directive('activarTime', function () {

    return {
        restrict: 'A',

        link: function(scope, el, attr) {

            var funct = window[attr.id];

            el.timepicker();



            $(el).click(function () {

                el.timepicker('showWidget');

            });

        }

    };

     });

 

 });
