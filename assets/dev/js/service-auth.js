/**
 * Created by rbanning on 6/26/2016.
 */
;(function (hallpass, app) {
    'use strict';

    app.factory('authService', [function () {

        var api = {
            currentUser: null,
            get isLoggedIn() {
                return !!this.currentUser;
            }
        };

        //this is just a stub... real app must allow for Google Auth
        api.login = function () {
            this.currentUser = {
                name: 'Test User',
                uid: 'test'
            };
            return this.currentUser;
        };

        api.logout = function () {
            this.currentUser = null;
        };


        return api;
    }]);

}(window.hallpass, angular.module(window.hallpass.ng.names.app)));