// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic','ionic.service.core', 'ngCordova', 'jett.ionic.filter.bar', 'ngOpenFB', 'ngRoute', 'starter.controllers', 'starter.routes', 'starter.services', 'starter.directives'])

    .run(function ($ionicPlatform) {
        $ionicPlatform.ready(function () {
            if (window.cordova && window.cordova.plugins.Keyboard) {
                // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
                // for form inputs)
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

                // Don't remove this line unless you know what you are doing. It stops the viewport
                // from snapping when text inputs are focused. Ionic handles this internally for
                // a much nicer keyboard experience.
                cordova.plugins.Keyboard.disableScroll(true);
            }
            if (window.StatusBar) {
                StatusBar.styleDefault();
            }
        });
    })

    .run(function ($ionicPlatform, ngFB) {
        ngFB.init({appId: '1044817092206732'}
        );
    })

    .run(function($ionicPlatform) {
        $ionicPlatform.ready(function() {
            var push = new Ionic.Push({
                "debug": true
            });

            push.register(function(token) {
                console.log("Device token:",token.token);
            });
        });
    })

    //.run(function($httpBackend){
    //    $httpBackend.whenGET(/templates\/\w+.*/).passThrough();
    //})