/**
 * Created by rbanning on 6/27/2016.
 */
;(function (hallpass, app) {
    'use strict';

    app.factory('apiTokenService', [function () {
        var tokens = [
            {site: 'localhost', scheme: 'hallpass-key', token: btoa("0101-AVVX-9400")},
            {site: 'myhallpass-dev.com', scheme: 'hallpass-key', token: btoa("0101-AVVX-9400")},
            {site: 'myhallpass.com', scheme: 'hallpass-key', token: btoa("0101-AVVX-9400")},
            {site: 'root', scheme: 'local', token: btoa("fancy")}
        ];
        tokens.local = tokens[tokens.length - 1];   //last entry is the local (default)

        return {
            request: function ($config) {

                var url = $config.url.toLowerCase();
                var rec = tokens.find(function (t) {
                    return url.indexOf(t.site) >= 0;
                });

                if (!rec) {
                    rec = tokens.local;
                }

                if (!!rec) {
                    $config.headers.Authorization = rec.scheme + " " + rec.token;
                    return $config;
                }

                return $config;
            }
        };
    }]);

}(window.hallpass, angular.module(window.hallpass.ng.names.app)));