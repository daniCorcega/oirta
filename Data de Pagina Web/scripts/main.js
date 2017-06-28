require.config({
    paths: {
        'domReady': '../bower_components/requirejs-domready/domReady',
        'jquery': '../bower_components/jquery/jquery',
        'angular': '../bower_components/angular/angular',
        'jquery.bootstrap': '../bower_components/bootstrap/dist/js/bootstrap',
        'bootstrap-tooltip': '../bower_components/bootstrap/js/tooltip',
        'angular.resource': '../bower_components/angular-resource/angular-resource',
        'angular.route': '../bower_components/angular-route/angular-route',
        'angular.uiRouter': '../bower_components/angular-ui-router/release/angular-ui-router',
        'ng-table': '../bower_components/ng-table/ng-table',
        'jquery.maskmoney': '../assets/vendor/jquery-maskmoney/jquery.maskMoney',
        'angular.bootstrap': '../bower_components/angular-bootstrap/ui-bootstrap-tpls',
        'porto.bootstrap': '../assets/vendor/bootstrap/js/bootstrap',
        'porto.jquery': '../assets/vendor/jquery/jquery',
        'porto.jquery.appear': '../assets/vendor/jquery-appear/jquery.appear',
        'porto.jquery.validate': '../assets/vendor/jquery-validation/jquery.validate',
        'porto.nanoscroller': '../assets/vendor/nanoscroller/nanoscroller',
        'porto.theme.init': '../assets/javascripts/theme.init',
        'porto.theme': '../assets/javascripts/theme',
        'porto.messages_es': '../assets/vendor/jquery-validation/messages_es',
        'porto.jquery.bootstrap-wizard': '../assets/vendor/bootstrap-wizard/jquery.bootstrap.wizard',
        'porto.pnotify': '../assets/vendor/pnotify/pnotify.custom',
        'porto.jquery.browser.mobile': '../assets/vendor/jquery-browser-mobile/jquery.browser.mobile',
        'porto.bootstrap.datepicker': '../assets/vendor/bootstrap-datepicker/js/bootstrap-datepicker',
        'porto.bootstrap.datepicker.spanish': '../assets/vendor/bootstrap-datepicker/js/locales/bootstrap-datepicker.es',
        'porto.bootstrap.maskedinput': '../assets/vendor/jquery-maskedinput/jquery.maskedinput',
        'porto.jquery.ui': '../assets/vendor/jquery-ui/js/jquery-ui-1.10.4.custom.min'
    },

    shim: {
        'angular': {
            deps: ['jquery'],
            exports: 'angular'
        },
        'angular.route': {
            deps: ['angular']
        },
        'angular.uiRouter': {
            deps: ['angular']
        },
        'angular.resource': {
            deps: ['angular']
        },
        'angular.bootstrap': {
            deps: ['angular']
        },
        'ng-table': {
            deps: ['angular']
        },
        'jquery.bootstrap': {
            deps: ['jquery']
        },
        'jquery.maskmoney': {
            deps: ['porto.jquery']
        },
        'porto.bootstrap': {
            deps: ['jquery']
        },
        'porto.jquery.appear': {
            deps: ['porto.jquery']
        },
        'porto.jquery.validate': {
            deps: ['porto.jquery']
        },
        'porto.theme': {
            deps: ['porto.jquery', 'porto.nanoscroller']
        },
        'porto.theme.init': {
            deps: ['porto.jquery', 'porto.theme']
        },
        'porto.messages_es': {
            deps: ['porto.jquery', 'porto.jquery.validate']
        },
        'porto.jquery.bootstrap-wizard': {
            deps: ['porto.jquery', 'porto.bootstrap']
        },
        'porto.pnotify':{
            deps: ['porto.jquery']
        },
        'porto.bootstrap.datepicker':{
            deps: ['porto.jquery', 'porto.bootstrap']
        },
        'porto.bootstrap.datepicker.spanish':{
            deps: ['porto.jquery', 'porto.bootstrap', 'porto.bootstrap.datepicker']
        },
        'porto.bootstrap.maskedinput':{
            deps: ['porto.jquery']
        },
        'porto.jquery.ui':{
            deps: ['porto.jquery']
        },
        'porto.nanoscroller':{
            deps: ['porto.jquery']
        }
    },

    deps: ['./bootstrap']
});
