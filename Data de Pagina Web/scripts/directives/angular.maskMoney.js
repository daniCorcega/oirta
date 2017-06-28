define(['angular'], function(ng){
    'use strict';
    ng.module('maskMoney', [])
    .directive('maskMoney', function($timeout) {
        return {
            restrict: 'A',
            require: 'ngModel',
            scope: {
                model: '=ngModel',
                mmOptions: '=?',
                prefix: '=',
                suffix: '=',
                affixesStay: '=',
                thousands: '=',
                decimal: '=',
                precisoin: '=',
                allowZero: '=',
                allowNegative: '='
            },
            link: function(scope, el, attr, ctrl) {

                scope.$watch(checkOptions, init, true);

                scope.$watch(attr.ngModel, eventHandler, true);
                //el.on('keyup', eventHandler); //change to $watch or $observe

                function checkOptions() {
                    return scope.mmOptions;
                }

                function checkModel() {
                    return scope.model;
                }

                //this parser will unformat the string for the model behid the scenes
                function parser() {
                    var value = $(el).val();
                    return parseInt(value.replace(/,/g, ''));
                }
                ctrl.$parsers.push(parser)

                function eventHandler() {
                    $timeout(function() {
                        scope.$apply(function() {
                            ctrl.$setViewValue($(el).val());
                        });
                    })
                }

                function init(options) {
                    $timeout(function() {
                        var elOptions = {
                            prefix: scope.prefix || '',
                            suffix: scope.suffix,
                            affixesStay: scope.affixesStay,
                            thousands: scope.thousands,
                            decimal: scope.decimal,
                            precision: scope.precision,
                            allowZero: scope.allowZero,
                            allowNegative: scope.allowNegative
                        }

                        if (!scope.mmOptions) {
                            scope.mmOptions = {};
                        }

                        for (var option in elOptions) {
                            if (elOptions[option]) {
                                scope.mmOptions[option] = elOptions[option];
                            }
                        }

                        $(el).maskMoney(scope.mmOptions);
                        $(el).maskMoney('mask');
                        eventHandler()

                    }, 0);

                    $timeout(function() {
                        scope.$apply(function() {
                            ctrl.$setViewValue($(el).val());
                        });
                    })

                }
            }
        }
    });

/*

todo:

add live update option
update on blur
or update on change

live update inline attributes

eventually, remove jquery and mask-money deps

*/


});

