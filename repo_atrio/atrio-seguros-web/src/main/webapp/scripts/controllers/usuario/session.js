define(['angular'], function (angular) {
    'use strict';
    var sessionControllers = angular.module('sessionControllers',['ngIdle', 'ui.bootstrap']);

    sessionControllers.controller('sessionCtr', ['$scope', 'Idle', '$modal', function($scope, Idle, $modal) {
        $scope.events = [];

	function closeModals() {
            if ($scope.warning) {
		$scope.warning.close();
		$scope.warning = null;
            }

            if ($scope.timedout) {
		$scope.timedout.close();
		$scope.timedout = null;
            }
	}


        $scope.$on('IdleStart', function() {
            // the user appears to have gone idle
            closeModals();

            $scope.warning = $modal.open({
		templateUrl: 'views/usuario/sesionCerrada.html'
            });
        });

        $scope.$on('IdleWarn', function(e, countdown) {
            // follows after the IdleStart event, but includes a countdown until the user is considered timed out
            // the countdown arg is the number of seconds remaining until then.
            // you can change the title or display a warning dialog from here.
            // you can let them resume their session by calling Idle.watch()
        });

        $scope.$on('IdleTimeout', function() {
            // the user has timed out (meaning idleDuration + timeout has passed without any activity)
            // this is where you'd log them
            closeModals();
            $scope.timedout = $modal.open({
		templateUrl: 'views/usuario/sesionCerrada.html',
		backdrop: 'static',
    keyboard: false
            });
        });

        $scope.$on('IdleEnd', function() {
            // the user has come back from AFK and is doing stuff. if you are warning them, you can use this to hide the dialog
	    closeModals();
        });

        $scope.$on('Keepalive', function() {
            // do something to keep the user's session alive
        });
    }]);
});
