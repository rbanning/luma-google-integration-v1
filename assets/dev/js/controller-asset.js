/**
 * Created by rbanning on 4/11/2016.
 */
;(function (hallpass, app) {
    'use strict';

    app.controller('AssetCtrl', ['$timeout', '$stateParams', 'authService', 'gooEventsService',
        function ($timeout, $stateParams, authService, gooEventsService) {

            var self = this;

            //auto login ... just of r testing
            if (!authService.isLoggedIn) {
                authService.login();
            }

            var _notificationID = null,
                clearNotification = function () {
                    if (_notificationID) {
                        $timeout.cancel(_notificationID);
                    }
                    self.notification = null;
                },
                setNotification = function (text, delay) {
                    delay = delay || 5000;
                    clearNotification();
                    self.notification = text;
                    _notificationID = $timeout(function () {
                        self.notification = null;
                    }, delay);
                };

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

            self.save = function () {
                clearNotification();
                gooEventsService.updateRecord(self.gooEvent)
                    .then(function () {
                        setNotification("changes were saved!");
                    }).catch(function (reason) {
                        self.errorMessage = reason.status + ": " + reason.statusText;
                        console.warn("gooEvents", reason);
                });
            };

        }]);

}(window.hallpass, angular.module(window.hallpass.ng.names.app)));


