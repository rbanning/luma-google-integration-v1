/**
 * Created by rbanning on 4/11/2016.
 */
;(function (hallpass, app) {
    'use strict';

    app.controller('HomeCtrl', ['authService', 'gooEventsService', function (authService, gooEventsService) {
        var self = this;

        //auto login ... just of r testing
        if (!authService.isLoggedIn) {
            authService.login();
        }

        
        self.user = authService.currentUser;
        self.isLoggedIn = authService.isLoggedIn;
        self.isLoaded = false;

        if (self.isLoggedIn) {
            gooEventsService.getFor(self.user.uid)
                .then(function (results) {
                    self.gooEvents = results;
                    console.log("gooEvents", results);
                }).catch(function (reason) {
                self.errorMessage = reason.status + ": " + reason.statusText;
                console.warn("gooEvents", reason);
            }).finally(function () {
                self.isLoaded = true;
            });
        }
        
    }]);

}(window.hallpass, angular.module(window.hallpass.ng.names.app)));


