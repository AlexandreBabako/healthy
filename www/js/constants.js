angular.module('starter')

    .constant('AUTH_EVENTS', {
        notAuthenticated: 'auth-not-authenticated',
        notAuthorized: 'auth-not-authorized'
    })

    .constant('USER_ROLES', {
        admin: 'admin_role',
        public: 'public_role'
    })

    .constant('VIEW_LEFT_MENU' , {
        hide: 1,
        show: -1
    })

    .constant('$ionicLoadingConfig', {
        templateUrl: 'templates/loading-spinner.html'
    });