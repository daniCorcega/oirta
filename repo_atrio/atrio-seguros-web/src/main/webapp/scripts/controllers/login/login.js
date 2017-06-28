define([ 'angular' ], function(angular) {
	'use strict';
	var userControllers = angular.module('userControllers', []);

	userControllers.controller('LoginCtr', [ '$scope', '$rootScope','mensaje',
			function($scope, $rootScope,mensaje, AUTH_EVENTS, AuthService) {
				$scope.credentials = {
					username : '',
					password : ''
				};

			} ]);
});
