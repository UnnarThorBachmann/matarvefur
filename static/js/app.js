'use strict';

var app = angular.module('matarapp',
    ['conferenceControllers', 'ngRoute', 'ui.bootstrap']).
    config(['$routeProvider',
        function ($routeProvider) {
            $routeProvider.
                when('/neysla/skraogskoda', {
                    templateUrl: '/partials/skraogskoda.html',
                    controller: 'SkraOgSkodaCtrl'
                }).
                when('/neysla/tolfraedi', {
                    templateUrl: '/partials/tolfraedi.html',
                    controller: 'TolfraediCtrl'
                }).
                when('/neysla/skra:dags', {
                    templateUrl: '/partials/skra.html',
                    controller: 'SkraCtrl'
                }).
                when('/', {
                    templateUrl: '/partials/home.html'
                }).
                otherwise({
                    redirectTo: '/'
                });
        }]);

app.factory('oauth2Provider', function ($modal) {
    var oauth2Provider = {
        CLIENT_ID: '2696834811-72f8727n8t7iipvlfv8d1u1kemfjl588.apps.googleusercontent.com',
        SCOPES: 'email profile',
        signedIn: false
    }

    /**
     * Calls the OAuth2 authentication method.
     */
    oauth2Provider.signIn = function (callback) {
        gapi.auth.signIn({
            'clientid': oauth2Provider.CLIENT_ID,
            'cookiepolicy': 'single_host_origin',
            'accesstype': 'online',
            'approveprompt': 'auto',
            'scope': oauth2Provider.SCOPES,
            'callback': callback
        });
    };

    /**
     * Logs out the user.
     */
    oauth2Provider.signOut = function () {
        gapi.auth.signOut();
        // Explicitly set the invalid access token in order to make the API calls fail.
        gapi.auth.setToken({access_token: ''})
        oauth2Provider.signedIn = false;
    };

    /**
     * Shows the modal with Google+ sign in button.
     *
     * @returns {*|Window}
     */
    oauth2Provider.showLoginModal = function() {
        var modalInstance = $modal.open({
            templateUrl: '/partials/login.modal.html',
            controller: 'OAuth2LoginModalCtrl'
        });
        return modalInstance;
    };

    return oauth2Provider;
});
