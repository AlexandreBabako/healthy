angular.module('starter.routes', [])

    .config(function ($stateProvider, $urlRouterProvider) {

        // Ionic uses AngularUI Router which uses the concept of states
        // Learn more here: https://github.com/angular-ui/ui-router
        // Set up the various states which the app can be in.
        // Each state's controller can be found in controllers.js
        $stateProvider


            .state('Slider', {
                url: '/',
                templateUrl: 'templates/slider.html',
                controller: 'SliderCtrl'
            })

            .state('Login', {
                url: '/login',
                templateUrl: 'templates/login.html',
                controller: 'LoginCtrl'
            })

            .state('Register', {
                url: '/register',
                templateUrl: 'templates/register.html',
                controller: 'RegisterCtrl'
            })

            .state('main', {
                url: '/main',
                templateUrl: 'templates/main.html',
                abstract: true
            })

            .state('main.tips', {
                url: '/tips',
                views: {
                    'main-tips': {
                        templateUrl: 'templates/first-page.html',
                        controller: 'TipsCtrl'
                    }
                }
            })

            .state('main.diseases', {
                url: '/diseases',
                views: {
                    'main-diseases': {
                        templateUrl: 'templates/second-page.html',
                        controller: 'DiseasesCtrl'
                    }
                }
            })

            .state('main.diseases-detail', {
                url: '/diseases/:diseasesId',
                views: {
                    'main-diseases': {
                        templateUrl: 'templates/diseases-detail.html',
                        controller: 'DiseasesDetailsCtrl'
                    }
                }
            })

            .state('main.diseases-full', {
                url: '/diseases/:diseasesId/:diseasesfullId',
                views: {
                    'main-diseases': {
                        templateUrl: 'templates/diseases-full-detail.html',
                        controller: 'DiseasesFullCtrl'
                    }
                }
            })

            .state('main.nouseful', {
                url: '/nouseful',
                views: {
                    'main-nouseful': {
                        templateUrl: 'templates/third-page.html',
                        controller: 'NousefulCtrl'
                    }
                }
            })

            .state('main.nouseful-detail', {
                url: '/nouseful/:nousefulId',
                views: {
                    'main-nouseful': {
                        templateUrl: 'templates/nouseful-detail.html',
                        controller: 'NousefulDetailCtrl'
                    }
                }
            })

            .state('search', {
                url: '/search',
                templateUrl: 'templates/search.html',
                controller: 'MainController'
            });

        ;

        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/');

        //$urlRouterProvider.otherwise(function ($injector, $location) {
        //    var $state = $injector.get("$state");
        //    $state.go("Slider");
        //});

    });