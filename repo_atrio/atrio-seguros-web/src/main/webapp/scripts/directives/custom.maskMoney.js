define(['angular'], function(ng){
    'use strict';
    var maskMoney = ng.module('custoMaskMoney', [])
    maskMoney.directive('custoMaskMoney', function($timeout) {
        return {
            restrict: 'A',
            require: 'ngModel',
            scope: {
                model: '=ngModel',
                numberos: '@'
            },
            link: function(scope, el, attr, ctrl) {
                scope.numeros = ['1','2','3','4','5','6','7','8','9','0'];

                $(el).on('keyup focus change', function (e) {
                    scope.$apply(function() {
                        dotizer(numeralizer($(el)));
                        ctrl.$setViewValue($(el).val());
                    });
                });

                function parser() {
                    return parseInt(numeralizer($(el)));
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

    maskMoney.directive('custoMaskMoneyy', function($timeout) {
        return {
            restrict: 'A',
            require: 'ngModel',
            scope: {
                model: '=ngModel',
                numberos: '@'
            },
            link: function(scope, el, attr, ctrl) {
                scope.numeros = ['1','2','3','4','5','6','7','8','9','0',','];

                $(el).on('keyup focus change', function (e) {
                    scope.$apply(function() {
                        dotizer(numeralizer($(el)));
                        ctrl.$setViewValue($(el).val());
                    });
                });

                function parser() {
                    return parseInt(numeralizer($(el)));
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


});
