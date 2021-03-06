define(['angular'], function (angular) {
    'use strict';
    var filters = angular.module('atrioFilters', []);

    filters.filter('checkmark', function(){
        return function(input){
            return input ? ' fa-check-square-o' : 'fa-square-o';
        };
    });

    filters.filter('sino', function(){
        return function(input){
            return input ? ' Si' : 'No';
        };
    });

    filters.filter('sinoSN', function(){
     return function(input){
         return input == 'S' ? ' Si' : 'No';
     };
 });

    filters.filter('num', function(){
        return function(input){
            return parseFloat(input) || 0;
        };
    });

    filters.filter('monedaVenezolana', function(){
        return function(input){
            var str = input + '';
	    var new_str = '';
	    for (var i = 0; i < str.length; i++) {
	        if (str[i] == ',') {
		    new_str = new_str + '.';
	        } else if (str[i] == '.') {
		    new_str = new_str +',';
	        } else {
		    new_str = new_str + str[i];
	        }
	    }
	    return new_str;
        };
    });

    filters.filter('monedaVenezolana', function(){
        return function(input){
            var str = input + '';
	    var new_str = '';
	    for (var i = 0; i < str.length; i++) {
	        if (str[i] == ',') {
		    new_str = new_str + '.';
	        } else if (str[i] == '.') {
		    new_str = new_str +',';
	        } else {
		    new_str = new_str + str[i];
	        }
	    }
	    return new_str
        };
    });

    filters.filter('tel', function(){
        return function (tel) {
            if (!tel) { return ''; }

            var value = tel.toString().trim().replace(/^\+/, '');
            var number =  value;

            switch (value.length) {
                case 10:
                    number = value.slice(0,3) + '-' + value.slice(3);
                    break;
                case 11:
                    number = value.slice(0,4) + '-' + value.slice(4);
                    break;
                default:
                    return value;
            };
            return number;
        };
    });

    filters.filter('codAreas', function () {
        return function(codigos,codigo) {
            var out = [];
            for (var i = 0; i < codigos.length; i++) {
                if (codigos[i].codestado == codigo || codigos[i].codestado == '099') {
                    out.push(codigos[i]);
                };
            };
            return out;
        };
    });

    filters.filter('parentescosSexo', function () {
        return function(parentescos, sexo, titular) {
            var out = [];
            titular = titular == 'S' ? true : false;
            sexo = typeof sexo != 'undefined'? sexo.substring(0,1) : '';
            if (sexo == 'M') {
                for (var i =0; i < parentescos.length; i++) {

                    if (parentescos[i].codlval == '0001') {
                        if (titular) {
                            out.push(parentescos[i]);
                        };
                    } else {
                        var exp = /FEMENINO|MADRE|\w+A$|\w+AS$/i;
                        if (!parentescos[i].descrip.match(exp)){
                            out.push(parentescos[i]);
                        };
                    };
                };
            } else if (sexo == 'F') {
                for (var i = 0; i < parentescos.length; i++) {
                    if (parentescos[i].codlval == '0002') {
                        if (titular) {
                            out.push(parentescos[i]);
                        };
                    } else {
                        var exp = /PADRE|\w+O$|\w+OS$/i;
                        if (!parentescos[i].descrip.match(exp)){
                            out.push(parentescos[i]);
                        };
                    };

                };

            };
            return out;
        };
    });
});
