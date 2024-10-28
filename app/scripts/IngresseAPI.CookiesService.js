'use strict';

angular.module('ingresseSDK')
.factory('ingresseApiCookies', function ($location, ingresseApiPreferences, ipCookie) {
    /**
     * Constants
     */
    var DOMAIN = '.ingresse.com';

    /**
     * Concat Cookie name
     *
     * @param {string} cname - Cookie name
     *
     * @return {string}
     */
    function _concat (cname) {
        var cookieName = '';
        var companyId  = ingresseApiPreferences.getCompanyId();
        var env        = ingresseApiPreferences.getEnv();
        var envConcat  = (env !== 'prod' ? (env + '_') : '');

        return cookieName.concat(
            'ing',
            '_',
            companyId,
            '_',
            envConcat,
            (cname || '')
        );
    };

    /**
     * Just an Interface to the 'ipCookie' API
     *
     * @param {string}   cname          - Cookie name
     * @param {anything} content        - Cookie content      | Optional
     * @param {number}   expires        - Cookie days limit   | Optional
     * @param {string}   expirationUnit - Cookie expires unit | Optional (default: days)
     */
    return function (cname, content, expires, expirationUnit) {
        cname     = _concat(cname);
        var props = {
            domain: (($location.host().indexOf(DOMAIN) < 0) ? $location.host() : DOMAIN),
            path  : '/',
            secure : true,
            samesite : 'Strict'
        };

        if (typeof expires === 'number') {
            props = angular.extend({}, props, {
                expires       : expires,
                expirationUnit: (expirationUnit || 'days'),
            });
        }

        if (typeof content === 'undefined') {
            return ipCookie(cname);
        }

        ipCookie(
            cname,
            (content || ''),
            props
        );
    };
});
