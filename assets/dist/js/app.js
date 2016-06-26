/** JS :: app-camp - v0.1.0 :: 2016-06-25 **/
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
            return hallpass.siteroot + 'templates/' + name + "?_v=" + (new Date()).getTime();
        }
    }

    window.hallpass = $.extend(true, {}, window.hallpass, hallpass);

}(window, jQuery));