/**
 * Created by rbanning on 4/10/2016.
 */
;(function (window, hallpass) {
    'use strict';

    var app = angular.module(hallpass.ng.names.app, ['ui.router']);


    //SETUP AUTHORIZATION
    app.config(['$httpProvider', function ($httpProvider) {
        $httpProvider.interceptors.push('apiTokenService');
    }]);


    //SETUP VIEWS (ROUTES)
    app.config(function ($stateProvider, $urlRouterProvider) {

        $urlRouterProvider.otherwise('/home');

        $stateProvider
            .state('home', {
                url: '/home',
                controller: 'HomeCtrl',
                controllerAs: 'vm',
                templateUrl: hallpass.ng.templatePath('home.html')
            })
            .state('asset', {
                url: '/asset/:id',
                controller: 'AssetCtrl',
                controllerAs: 'vm',
                templateUrl: hallpass.ng.templatePath('asset.html')
            })
            .state('login', {
                url: '/login',
                controller: 'LoginCtrl',
                controllerAs: 'vm',
                templateUrl: hallpass.ng.templatePath('login.html')
            })
            .state('logout', {
                url: '/logout',
                controller: 'LogoutCtrl'
            });

    });

}(window, window.hallpass));