define(['angular'], function (ng) {
    'use strict';
    var templatesDirectives = ng.module('templates', []);

 
    templatesDirectives.directive('acordeonActivo', function () {
	return {
	    restrict: 'A',
            require: '?ngModel',
	    link: function(scope, el, attr,ctrl) {
		$(document).ready(function () {
		    var activo = attr.acordeonActivo;
                    var valor = attr.acordeonValor;
                    if (activo == valor) {
		        $(el).addClass('in');
                    }
		});
	    }
	};
    });

    templatesDirectives.directive('ngLoadSlider', function () {
	return {
	    restrict: 'A',
	    link: function(scope, el, attr,ctrl) {
                var atributos = attr;
                $(el).mousedown(function (event) {
                    var object = attr.ngLoadSlider == '' ? el : $(attr.ngLoadSlider);
                    $(object).slider({
                        max:parseInt(object.attr('ng-load-max')),
                        min:parseInt(object.attr('ng-load-min')),
                        value:parseInt(object.attr('ng-load-value')),
                        range: 'min',
                        step: parseInt(object.attr('ng-load-step'))
                    });
                });
            }
        };
    });

    templatesDirectives.directive('ngSlider', function () {
	return {
	    restrict: 'A',
	    link: function(scope, el, attr,ctrl) {
		$(el).blur(function (event) {
		    var new_value = el.val();
                    new_value = new_value.split(".");
                    new_value = new_value.join("");
                    new_value = parseInt(new_value);
                    var slider = attr.ngSlider;
                    $(slider).slider({value:new_value});
                });
            }
	};
    });
});
