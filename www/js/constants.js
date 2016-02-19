angular.module('starter')

    .constant('AUTH_EVENTS', {
        notAuthenticated: 'auth-not-authenticated',
        notAuthorized: 'auth-not-authorized'
    })

    .constant('USER_ROLES', {
        payed: 'payed_role',
        free: 'free_role'
    })

    .constant('VIEW_LEFT_MENU' , {
        hide: 1,
        show: -1
    })

    .constant('$ionicLoadingConfig', {
        templateUrl: 'templates/loading-spinner.html'
    });