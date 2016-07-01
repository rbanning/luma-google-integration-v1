/**
 * Created by rbanning on 4/11/2016.
 */
;(function (hallpass, app) {
    'use strict';

    app.controller('AssetCtrl', ['$stateParams', 'authService', 'gooEventsService', function ($stateParams, authService, gooEventsService) {
        var self = this;

        //auto login ... just of r testing
        if (!authService.isLoggedIn) {
            authService.login();
        }


        self.user = authService.currentUser;
        self.isLoggedIn = authService.isLoggedIn;
        self.isLoaded = false;

        if (self.isLoggedIn) {
            var id = $stateParams.id;
            gooEventsService.getRecord(id)
                .then(function (result) {
                    self.gooEvent = result;
                    console.log("gooEvent", result);
                }).catch(function (reason) {
                self.errorMessage = reason.status + ": " + reason.statusText;
                console.warn("gooEvents", reason);
            }).finally(function () {
                self.isLoaded = true;
            });
        }

    }]);

}(window.hallpass, angular.module(window.hallpass.ng.names.app)));


