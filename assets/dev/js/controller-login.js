/**
 * Created by rbanning on 4/11/2016.
 */
;(function (hallpass, app) {
    'use strict';

    app.controller('LoginCtrl', ['$state', 'authService', function ($state, authService) {
        var self = this;

        self.errorMessage = null;

        self.login = function () {
            if (!!authService.login()) {
                $state.go('home');    //redirect home
            } else {
                self.errorMessage = "Invalid username and/or password!";
            }

        };
    }]);

}(window.hallpass, angular.module(window.hallpass.ng.names.app)));


