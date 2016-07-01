/** JS :: app-camp - v0.1.0 :: 2016-06-30 **/
/**
 * Created by rbanning on 4/10/2016.
 */
;(function (window, $) {
    'use strict';

    var hallpass = {
        version: "2016.06a",
        _siteroot: null,
        get siteroot() {
            if (!this._siteroot) {
                var parts = window.location.pathname.split('/').filter(Boolean);
                parts.splice(3);    //remove all but the first three parts of the path
                this._siteroot = '/' + parts.join('/') + '/';

                //got to think of a better way
                this._siteroot = "/";
            }
            return this._siteroot;
        },
        guid: function () {
            var api = {};
            api.generate = function () {
                function s4() {
                    return Math.floor((1 + Math.random()) * 0x10000)
                        .toString(16)
                        .substring(1);
                }

                return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
                    s4() + '-' + s4() + s4() + s4();
            };

            return api;
        }()
    };
    hallpass.ng = {
        names: {
            app: 'GooApp',
            common: 'GooAppCommon'
        },
        templatePath: function (name) {
            //return hallpass.siteroot + 'templates/' + name + "?_v=" + (new Date()).getTime();
            return 'templates/' + name + "?_v=" + (new Date()).getTime();
        }
    };


    window.hallpass = $.extend(true, {}, window.hallpass, hallpass);

}(window, jQuery));
/** end lib **/
/**
 * Created by rbanning on 4/10/2016.
 */
;(function (window, hallpass) {
    'use strict';

    var app = angular.module(hallpass.ng.names.app, ['ui.router']);


    //SETUP AUTHORIZATION
    app.config(['$httpProvider', function ($httpProvider) {
        $httpProvider.interceptors.push('apiTokenService');
    }]);


    //SETUP VIEWS (ROUTES)
    app.config(function ($stateProvider, $urlRouterProvider) {

        $urlRouterProvider.otherwise('/home');

        $stateProvider
            .state('home', {
                url: '/home',
                controller: 'HomeCtrl',
                controllerAs: 'vm',
                templateUrl: hallpass.ng.templatePath('home.html')
            })
            .state('asset', {
                url: '/asset/:id',
                controller: 'AssetCtrl',
                controllerAs: 'vm',
                templateUrl: hallpass.ng.templatePath('asset.html')
            })
            .state('login', {
                url: '/login',
                controller: 'LoginCtrl',
                controllerAs: 'vm',
                templateUrl: hallpass.ng.templatePath('login.html')
            })
            .state('logout', {
                url: '/logout',
                controller: 'LogoutCtrl'
            });

    });

}(window, window.hallpass));
/** end lib **/
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



/** end lib **/
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


/** end lib **/
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


/** end lib **/
/**
 * Created by rbanning on 4/11/2016.
 */
;(function (hallpass, app) {
    'use strict';

    app.controller('LogoutCtrl', ['$state', 'authService', function ($state, authService) {

        authService.logout();
        $state.go('login');

    }]);

}(window.hallpass, angular.module(window.hallpass.ng.names.app)));


/** end lib **/
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
/** end lib **/
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
/** end lib **/
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

        return api;

    }]);


}(angular.module(window.hallpass.ng.names.app)));