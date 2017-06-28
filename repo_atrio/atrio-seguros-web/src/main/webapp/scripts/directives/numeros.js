define(['angular'], function(ng){
    'use strict';
    var numerosDirectives = ng.module('numeros', []);

    numerosDirectives.directive('soloNumeros', function($timeout) {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function(scope, el, attr, ctrl) {
                scope.numeros = ['1','2','3','4','5','6','7','8','9','0'];

                $(el).on('keyup focus', function (e) {
                    scope.$apply(function() {
			var nuevo_valor = numeralizer($(el));
                        ctrl.$setViewValue($(el).val(nuevo_valor));
                    });
                });

                function parser() {
		    return parseInt(numeralizer($(el)))
                };

                ctrl.$parsers.push(parser);

                function numeralizer(element) {
                    var str = element.val();
                    var new_str = '';
                    for (var i = 0; i < str.length; i++) {
                        if (jQuery.inArray(str[i], scope.numeros) >= 0) {
                            new_str = new_str + str[i];
                        }
                    }
                    return new_str;
                };

            }
        }
    });


    numerosDirectives.directive('soloNumeros1', function($timeout) {
        return {
            restrict: 'A',
            require: 'ngModel',
            scope: {
                model: '=ngModel',
                numberos: '@'
            },
            link: function(scope, el, attr, ctrl) {
                scope.numeros = ['1','2','3','4','5','6','7','8','9','0',',','.'];

                $(el).on('keyup focus change', function (e) {
                    scope.$apply(function() {
			var nuevo_valor = numeralizer($(el));
                        ctrl.$setViewValue($(el).val(nuevo_valor));
                    });
                });

                function parser() {
		    return parseInt(numeralizer($(el)))
                };

                ctrl.$parsers.push(parser);

                function numeralizer(element) {
                    var str = element.val();
                    var new_str = '';
                    for (var i = 0; i < str.length; i++) {
                        if (jQuery.inArray(str[i], scope.numeros) >= 0) {
                            new_str = new_str + str[i];
                        }
                    }
                    return new_str;
                };
                function dotizer(str) {
                    var size = str.length;
                    var new_str = '';
                    var begin = size % 3;
                    var rounds = parseInt(size / 3);
                    if (begin == 0) {
                        begin = 3;
                        rounds = rounds - 1;
                    };
                    new_str = str.substring(0,begin)
                    for (var i = 0; i < rounds; i++) {
                        var range = begin + (i * 3);
                        var tmp = str.substring(range,range+3);
                        new_str = new_str+'.'+tmp;
                    }
                    $(el).val(new_str);
                };
            }
        }
    });

    numerosDirectives.directive('maxNumero', function($timeout) {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function(scope, el, attr, ctrl) {

                $(el).on('keyup focus', function (e) {
                    scope.$apply(function() {
			var nuevo_valor = $(el).val();
			var max = $(el).attr('max-numero');
			if (nuevo_valor.length > 0) {
			    nuevo_valor = parseInt(nuevo_valor);
			    if (max.length >= 0) {
				max = parseInt(max);
				if (nuevo_valor > max) {
				    nuevo_valor = max
				}
			    }
			}

                        ctrl.$setViewValue($(el).val(nuevo_valor));
                    });
                });

                function parser() {
		    return parseInt($(el).val())
                };

                ctrl.$parsers.push(parser);

            }
        }
    });

    numerosDirectives.directive('minNumero', function($timeout) {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function(scope, el, attr, ctrl) {

                $(el).on('blur', function (e) {
                    scope.$apply(function() {
			var nuevo_valor = $(el).val();
			var min = $(el).attr('min-numero');
			if (nuevo_valor.length > 0) {
			    nuevo_valor = parseInt(nuevo_valor);
			    if (min.length >= 0) {
				min = parseInt(min);
				if (nuevo_valor < min) {
				    nuevo_valor = min
				}
			    }

			}

                        ctrl.$setViewValue($(el).val(nuevo_valor));
                    });
                });

                function parser() {
		    return parseInt($(el).val())
                };

                ctrl.$parsers.push(parser);

            }
        }
    });

});
