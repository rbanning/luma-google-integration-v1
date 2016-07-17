/**
 * Created by rbanning on 4/11/2016.
 */
;(function (hallpass, app) {
    'use strict';

    app.controller('TestCtrl', ['authService', 'gooEventsService', function (authService, gooEventsService) {
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
                }).catch(function (reason) {
                self.errorMessage = reason.status + ": " + reason.statusText;
                console.warn("gooEvents", reason);
            }).finally(function () {
                self.isLoaded = true;
            });
        }

        self.newEventTitle = null;

        self.addEvent = function () {
            var title = self.newEventTitle;

            var record = gooEventsService.newRecord(title, null, 'practice', 'website', 'me', self.user.uid);
            console.log("creating", record);

            gooEventsService.addRecord(record)
                .then(function (result) {
                    self.gooEvents.push(result);
                    self.newEventTitle = null;
                    console.log("done!", result);
                }).catch(function (reason) {
                self.errorMessage = reason.status + ": " + reason.statusText;
                console.warn("add error", reason);
            });
        };

        self.updateOwner = function (record) {
            if (record.owner === "me") {
                record.owner = "Rob";
            } else {
                record.owner = "me";
            }
            gooEventsService.updateRecord(record)
                .then(function (result) {
                    console.log("updated", result);
                }).catch(function (reason) {
                self.errorMessage = reason.status + ": " + reason.statusText;
                console.warn("update error", reason);
            });
        };
        
    }]);

}(window.hallpass, angular.module(window.hallpass.ng.names.app)));


