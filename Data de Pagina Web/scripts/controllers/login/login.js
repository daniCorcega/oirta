define([ 'angular' ], function(angular) {
	'use strict';
	var userControllers = angular.module('userControllers', []);

	userControllers.controller('LoginCtr', [ '$scope', '$rootScope', 
			function($scope, $rootScope, AUTH_EVENTS, AuthService) {
				$scope.credentials = {
					username : '',
					password : ''
				};

			} ]);
});