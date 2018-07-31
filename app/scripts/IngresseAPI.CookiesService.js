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

        return cookieName.concat(
            'ing',
            '_',
            ingresseApiPreferences.getCompanyId(),
            '_',
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
        cname = _concat(cname);

        if (typeof content === 'undefined') {
            return ipCookie(cname);
        }

        ipCookie(
            cname,
            (content || ''),
            (typeof expires === 'number' ?
                {
                    domain        : (($location.host().indexOf(DOMAIN) < 0) ? $location.host() : DOMAIN),
                    expires       : expires,
                    expirationUnit: (expirationUnit || 'days'),
                }
                : null
            )
        );
    };
});
