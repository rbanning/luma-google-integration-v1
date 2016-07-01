/**
 * Created by rbanning on 6/29/2016.
 */
;(function (app) {
    'use strict';

    app.factory('gooEventsService', ['$http', function ($http) {

        //var baseUrl = 'https://www.myhallpass.com/learning/dev/goo-dummy-data/api/goo-events/';
        var baseUrl = 'https://localhost:44308/api/goo-events/';

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

        return api;

    }]);


}(angular.module(window.hallpass.ng.names.app)));