define(['angular'], function (ng) {
    'use strict';
    var cambioFondoDirectives = ng.module('cambioFondo', []);

    cambioFondoDirectives.directive('cambioFondo', function () {
	return {
	    restrict: 'A',
	    link: function(scope, el, attr,ctrl) {
		$(document).ready(function () {
		    var new_class = $(el).attr('cambio-fondo');
		    $('[role=main]').removeClass().addClass('content-body').addClass('fondo-'+new_class);
		});
	    }
	}
    });
});