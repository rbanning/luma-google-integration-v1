/**
 * Created by rbanning on 4/11/2016.
 */
;(function (hallpass, app) {
    'use strict';

    app.controller('HomeCtrl', ['authService', function (authService) {
        var self = this;

        self.user = authService.currentUser;
        self.isLoggedIn = authService.isLoggedIn;

    }]);

}(window.hallpass, angular.module(window.hallpass.ng.names.app)));


