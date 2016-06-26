/**
 * Created by rbanning on 4/11/2016.
 */
;(function (hallpass, app) {
    'use strict';

    app.controller('LogoutCtrl', ['$state', 'authService', function ($state, authService) {

        authService.logout();
        $state.go('login');

    }]);

}(window.hallpass, angular.module(window.hallpass.ng.names.app)));


