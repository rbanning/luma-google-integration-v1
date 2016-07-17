/**
 * Created by rbanning on 6/29/2016.
 */
;(function (app) {
    'use strict';

    app.factory('gooEventsService', ['$http', function ($http) {

        var baseUrl = 'https://www.myhallpass.com/learning/dev/goo-dummy-data/api/goo-events/';
        //var baseUrl = 'https://localhost:44308/api/goo-events/';

        var api = {};

        api.getFor = function (uid) {
            var url = baseUrl + 'for/' + uid;
            return $http.get(url)
                .then(function (results) {
                    return results.data;
                });
        };

        api.getRecord = function (id) {
            var url = baseUrl + id;
            return $http.get(url)
                .then(function (result) {
                    return result.data;
                });
        };

        //creates a new blank record
        api.newRecord = function (title, date, type, context, owner, userID) {
            if (!date) {
                var f = function (n) {
                    return n > 9 ? "" + n : "0" + n;
                };
                var d = new Date();
                date = d.getFullYear() + '-' + f(d.getMonth() + 1) + '-' + f(d.getDate()) + 'T' + f(d.getHours()) + ':' + f(d.getMinutes()) + ':' + f(d.getSeconds());
            }
            return {
                title: title,
                date: date,
                type: type,
                context: context,
                owner: owner,
                userID: userID
            };
        };

        api.addRecord = function (record) {
            var url = baseUrl;
            return $http.post(url, record)
                .then(function (result) {
                    return result.data;
                });

        };

        api.updateRecord = function (record) {
            var url = baseUrl + record.id;
            return $http.post(url, record)
                .then(function (result) {
                    return result.data;
                });
        };

        api.deleteRecord = function (record) {
            var url = baseUrl + record.id;
            return $http.delete(url, record)
                .then(function (result) {
                    return result.data;
                });
        };

        return api;

    }]);


}(angular.module(window.hallpass.ng.names.app)));