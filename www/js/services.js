angular.module('starter.services', [])

    .service('AuthService', function($q, $http, USER_ROLES) {
        var LOCAL_TOKEN_KEY = 'yourTokenKey';
        var username = '';
        var isAuthenticated = false;
        var role = '';
        var authToken;

        function loadUserCredentials() {
            var token = window.localStorage.getItem(LOCAL_TOKEN_KEY);
            if (token) {
                useCredentials(token);
            }
        }

        function storeUserCredentials(token) {
            window.localStorage.setItem(LOCAL_TOKEN_KEY, token);
            useCredentials(token);
        }

        function useCredentials(token) {
            username = token.split('.')[0];
            isAuthenticated = true;
            authToken = token;

            if (username == 'admin') {
                role = USER_ROLES.admin
            }
            if (username == 'user') {
                role = USER_ROLES.public
            }

            // Set the token as header for your requests!
            $http.defaults.headers.common['X-Auth-Token'] = token;
        }

        function destroyUserCredentials() {
            authToken = undefined;
            username = '';
            isAuthenticated = false;
            $http.defaults.headers.common['X-Auth-Token'] = undefined;
            window.localStorage.removeItem(LOCAL_TOKEN_KEY);
        }

        var login = function(name, pw) {
            return $q(function(resolve, reject) {
                if ((name == 'admin' && pw == '1') || (name == 'user' && pw == '1')) {
                    // Make a request and receive your auth token from your server
                    storeUserCredentials(name + '.yourServerToken');
                    resolve('Login success.');
                } else {
                    reject('Login Failed.');
                }
            });
        };

        var logout = function() {
            destroyUserCredentials();
        };

        var isAuthorized = function(authorizedRoles) {
            if (!angular.isArray(authorizedRoles)) {
                authorizedRoles = [authorizedRoles];
            }
            return (isAuthenticated && authorizedRoles.indexOf(role) !== -1);
        };

        loadUserCredentials();

        return {
            login: login,
            logout: logout,
            isAuthorized: isAuthorized,
            isAuthenticated: function() {return isAuthenticated;},
            username: function() {return username;},
            role: function() {return role;}
        };
    })

    .factory('AuthInterceptor', function ($rootScope, $q, AUTH_EVENTS) {
        return {
            responseError: function (response) {
                $rootScope.$broadcast({
                    401: AUTH_EVENTS.notAuthenticated,
                    403: AUTH_EVENTS.notAuthorized
                }[response.status], response);
                return $q.reject(response);
            }
        };
    })

    .config(function ($httpProvider) {
        $httpProvider.interceptors.push('AuthInterceptor');
    })

    .factory('tips', function () {
        var tips = [{
            id: 0,
            title: 'Faites « parler » les épices',
            description: 'Souscrivez à notre service Plus d’astuces pour recevoir davantage directement par SMS.',
            img: 'img/tip-img.png',
            click: ''
        }, {
            id: 1,
            title: 'Dormir plus souvent',
            description: 'Le sommeil est un facteur essentiel pour la bonne croissance des bébés mais aussi des adultes…',
            img: 'img/tip-img.png',
            click: ''
        }, {
            id: 2,
            title: 'Vous désirez plus d’Astuces Santé ?',
            description: 'Souscrivez à notre service Plus d’astuces pour recevoir davantage directement par SMS.',
            img: 'img/tip-img.png',
            click: 'SubscribeConfirm()'
        }];

        return {
            all: function () {
                return tips;
            },
            get: function (tipId) {
                for (var i = 0; i < tips.length; i++) {
                    if (tips[i].id === parseInt(tipId)) {
                        return tips[i];
                    }
                }
                return null;
            }
        };
    })

    .factory('diseases', function () {
        var diseases = [{
            id: 0,
            title: 'ABCDEF'
        }, {
            id: 1,
            title: 'GHIJKL'
        }, {
            id: 2,
            title: 'MNOPQR'
        }, {
            id: 3,
            title: 'STUVWXYZ'
        }];

        return {
            all: function () {
                return diseases;
            },
            get: function (diseaseId) {
                for (var i = 0; i < diseases.length; i++) {
                    if (diseases[i].id === parseInt(diseaseId)) {
                        return diseases[i];
                    }
                }
                return null;
            }
        };
    })

    .factory('nousefuls', function () {
        var nousefuls = [{
            id: 0,
            title: 'Centres Hospitaliers Universitaires',
            description: 'Consulter la liste des CHU et CHR sur toute l’étendue du territoire Ivoirien.',
            short: 'СHU'
        }, {
            id: 1,
            title: 'Cliniques et centres de santé',
            description: 'Consulter la liste des cliniques et centres de santé dans tout le district d’Abidjan et Yamoussoukro.',
            short: 'СHU'
        }, {
            id: 2,
            title: 'Pharmacies de garde',
            description: 'Consulter la liste des pharmacies de garde dans le disctrict d’Abidjan et Yamoussoukro.',
            short: 'Pharmacies'
        }];

        return {
            all: function () {
                return nousefuls;
            },
            get: function (nousefulId) {
                for (var i = 0; i < nousefuls.length; i++) {
                    if (nousefuls[i].id === parseInt(nousefulId)) {
                        return nousefuls[i];
                    }
                }
                return null;
            }
        };
    })


    .factory('nousefulsDetails', function () {
        var nousefulDetales = [{
            id: 0,
            info: [{
                id: 0,
                title: 'Centre Hospitalier Universitaire de Cocody',
                description: 'Cocody, Boulevard de l’Université de Cocody',
                phone: '+225-223-234'
            }, {
                id: 1,
                title: 'Centre Hospitalier Universitaire de Treichville',
                description: 'Treichville, Boulevard de Marseille',
                phone: '+225-223-234'
            }, {
                id: 2,
                title: 'Centre Hospitalier Universitaire de Yopougon',
                description: 'Yopougon, 3e pont, Cité Mamie Adjoua',
                phone: '+225-223-234'
            }, {
                id: 3,
                title: 'Centre Hospitalier Universitaire de Bouaké',
                description: 'Bouaké, Rue de l’Aéroport',
                phone: '+225-223-234'
            }, {
                id: 4,
                title: 'Centre Hospitalier Régional de Bouaflé',
                description: 'Bouaflé',
                phone: '+225-223-234'
            }, {
                id: 5,
                title: 'Centre Hospitalier Régional de Bondoukou',
                description: 'Bondoukou',
                phone: '+225-223-234'
            }, {
                id: 6,
                title: 'Centre Hospitalier Régional de Daloa',
                description: 'Daloa',
                phone: '+225 32 78 22 90 / 32 78 36 23'
            }, {
                id: 7,
                title: 'Centre Hospitalier Régional de Daloa',
                description: 'Daloa',
                phone: '+225 32 78 22 90 / 32 78 36 23'
            }, {
                id: 8,
                title: 'Centre Hospitalier Régional de Bondoukou',
                description: 'Bondoukou',
                phone: '+225 35 91 51 78 / 35 91 51 79'
            }]
        }, {
            id: 1,
            info: [{
                id: 0,
                title: 'Centre Hospitalier Universitaire de Cocody',
                description: 'Cocody, Boulevard de l’Université de Cocody',
                phone: '+225 22 44 90 00/38'
            }, {
                id: 1,
                title: 'Centre Hospitalier Universitaire de Treichville',
                description: 'Treichville, Boulevard de Marseille',
                phone: '+225 21 25 65 70 / 21 24 91 22'
            }, {
                id: 2,
                title: 'Centre Hospitalier Universitaire de Yopougon',
                description: 'Yopougon, 3e pont, Cité Mamie Adjoua',
                phone: '+225 23 46 64 54 / 23 46 61 70'
            }, {
                id: 3,
                title: 'Centre Hospitalier Universitaire de Bouaké',
                description: 'Bouaké, Rue de l’Aéroport',
                phone: '+225 31 00 02 22 / 31 00 01 99'
            }, {
                id: 4,
                title: 'Centre Hospitalier Régional de Bouaflé',
                description: 'Bouaflé',
                phone: '+225 30 68 93 43 / 30 68 91 35'
            }, {
                id: 5,
                title: 'Centre Hospitalier Régional de Bondoukou',
                description: 'Bondoukou',
                phone: '+225 35 91 51 78 / 35 91 51 79'
            }, {
                id: 6,
                title: 'Centre Hospitalier Régional de Daloa',
                description: 'Daloa',
                phone: '+225 32 78 22 90 / 32 78 36 23'
            }, {
                id: 7,
                title: 'Centre Hospitalier Régional de Daloa',
                description: 'Daloa',
                phone: '+225 32 78 22 90 / 32 78 36 23'
            }, {
                id: 8,
                title: 'Centre Hospitalier Régional de Bondoukou',
                description: 'Bondoukou',
                phone: '+225 35 91 51 78 / 35 91 51 79'
            }]
        }, {
            id: 2,
            info: [{
                id: 0,
                title: 'Centre Hospitalier Universitaire de Cocody',
                description: 'Cocody, Boulevard de l’Université de Cocody',
                phone: '+225 22 44 90 00/38'
            }, {
                id: 1,
                title: 'Centre Hospitalier Universitaire de Treichville',
                description: 'Treichville, Boulevard de Marseille',
                phone: '+225 21 25 65 70 / 21 24 91 22'
            }, {
                id: 2,
                title: 'Centre Hospitalier Universitaire de Yopougon',
                description: 'Yopougon, 3e pont, Cité Mamie Adjoua',
                phone: '+225 23 46 64 54 / 23 46 61 70'
            }, {
                id: 3,
                title: 'Centre Hospitalier Universitaire de Bouaké',
                description: 'Bouaké, Rue de l’Aéroport',
                phone: '+225 31 00 02 22 / 31 00 01 99'
            }, {
                id: 4,
                title: 'Centre Hospitalier Régional de Bouaflé',
                description: 'Bouaflé',
                phone: '+225 30 68 93 43 / 30 68 91 35'
            }, {
                id: 5,
                title: 'Centre Hospitalier Régional de Bondoukou',
                description: 'Bondoukou',
                phone: '+225 35 91 51 78 / 35 91 51 79'
            }, {
                id: 6,
                title: 'Centre Hospitalier Régional de Daloa',
                description: 'Daloa',
                phone: '+225 32 78 22 90 / 32 78 36 23'
            }, {
                id: 7,
                title: 'Centre Hospitalier Régional de Daloa',
                description: 'Daloa',
                phone: '+225 32 78 22 90 / 32 78 36 23'
            }, {
                id: 8,
                title: 'Centre Hospitalier Régional de Bondoukou',
                description: 'Bondoukou',
                phone: '+225 35 91 51 78 / 35 91 51 79'
            }]
        }];

        return {
            get: function (id) {
                return nousefulDetales[id]['info'];
            }
        };
    })

    .factory('maladiesListDetails', function () {
        var maladiesListDetails = [{
            id: 0,
            info: [{
                id: 0,
                img: 'img/girl-img.png',
                title: 'Maux de tête et céphalées',
                general: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam massa quam. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisinuli.',
                causes: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam massa quam. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisinuli.',
                prevent: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam massa quam. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisinuli.'
            },{
                id: 1,
                img: 'img/girl-img.png',
                title: 'Méningite',
                general: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam massa quam. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisinuli.',
                causes: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam massa quam. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisinuli.',
                prevent: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam massa quam. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisinuli.'
            },{
                id: 2,
                img: 'img/girl-img.png',
                title: 'Ménopause',
                general: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam massa quam. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisinuli.',
                causes: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam massa quam. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisinuli.',
                prevent: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam massa quam. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisinuli.'
            },{
                id: 3,
                img: 'img/girl-img.png',
                title: 'Morsures humaines ou animales',
                general: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam massa quam. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisinuli.',
                causes: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam massa quam. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisinuli.',
                prevent: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam massa quam. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisinuli.'
            },{
                id: 4,
                img: 'img/girl-img.png',
                title: 'Mycoses',
                general: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam massa quam. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisinuli.',
                causes: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam massa quam. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisinuli.',
                prevent: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam massa quam. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisinuli.'
            },{
                id: 5,
                img: 'img/girl-img.png',
                title: 'Nausée',
                general: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam massa quam. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisinuli.',
                causes: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam massa quam. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisinuli.',
                prevent: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam massa quam. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisinuli.'
            },{
                id: 6,
                img: 'img/girl-img.png',
                title: 'Obésité',
                general: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam massa quam. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisinuli.',
                causes: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam massa quam. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisinuli.',
                prevent: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam massa quam. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisinuli.'
            },{
                id: 7,
                img: 'img/girl-img.png',
                title: 'Otite',
                general: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam massa quam. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisinuli.',
                causes: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam massa quam. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisinuli.',
                prevent: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam massa quam. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisinuli.'
            },{
                id: 8,
                img: 'img/girl-img.png',
                title: 'Paludisme',
                general: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam massa quam. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisinuli.',
                causes: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam massa quam. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisinuli.',
                prevent: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam massa quam. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisinuli.'
            },{
                id: 9,
                img: 'img/girl-img.png',
                title: 'Pied d’athlète',
                general: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam massa quam. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisinuli.',
                causes: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam massa quam. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisinuli.',
                prevent: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam massa quam. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisinuli.'
            },{
                id: 10,
                img: 'img/girl-img.png',
                title: 'Poliomyélite',
                general: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam massa quam. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisinuli.',
                causes: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam massa quam. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisinuli.',
                prevent: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam massa quam. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisinuli.'
            },{
                id: 11,
                img: 'img/girl-img.png',
                title: 'Rage',
                general: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam massa quam. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisinuli.',
                causes: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam massa quam. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisinuli.',
                prevent: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam massa quam. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisinuli.'
            },{
                id: 12,
                img: 'img/girl-img.png',
                title: 'Rhume et grippe',
                general: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam massa quam. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisinuli.',
                causes: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam massa quam. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisinuli.',
                prevent: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam massa quam. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisinuli.'
            },{
                id: 13,
                img: 'img/girl-img.png',
                title: 'Rage',
                general: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam massa quam. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisinuli.',
                causes: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam massa quam. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisinuli.',
                prevent: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam massa quam. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisinuli.'
            },{
                id: 14,
                img: 'img/girl-img.png',
                title: 'Poliomyélite',
                general: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam massa quam. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisinuli.',
                causes: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam massa quam. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisinuli.',
                prevent: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam massa quam. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisinuli.'
            }]
        },{
            id: 1,
            info: [{
                id: 0,
                img: 'img/girl-img.png',
                title: 'Maux de tête et céphalées',
                general: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam massa quam. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisinuli.',
                causes: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam massa quam. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisinuli.',
                prevent: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam massa quam. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisinuli.'
            },{
                id: 1,
                img: 'img/girl-img.png',
                title: 'Méningite',
                general: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam massa quam. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisinuli.',
                causes: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam massa quam. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisinuli.',
                prevent: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam massa quam. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisinuli.'
            },{
                id: 2,
                img: 'img/girl-img.png',
                title: 'Ménopause',
                general: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam massa quam. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisinuli.',
                causes: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam massa quam. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisinuli.',
                prevent: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam massa quam. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisinuli.'
            },{
                id: 3,
                img: 'img/girl-img.png',
                title: 'Morsures humaines ou animales',
                general: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam massa quam. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisinuli.',
                causes: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam massa quam. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisinuli.',
                prevent: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam massa quam. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisinuli.'
            },{
                id: 4,
                img: 'img/girl-img.png',
                title: 'Mycoses',
                general: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam massa quam. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisinuli.',
                causes: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam massa quam. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisinuli.',
                prevent: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam massa quam. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisinuli.'
            },{
                id: 5,
                img: 'img/girl-img.png',
                title: 'Nausée',
                general: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam massa quam. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisinuli.',
                causes: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam massa quam. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisinuli.',
                prevent: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam massa quam. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisinuli.'
            },{
                id: 6,
                img: 'img/girl-img.png',
                title: 'Obésité',
                general: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam massa quam. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisinuli.',
                causes: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam massa quam. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisinuli.',
                prevent: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam massa quam. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisinuli.'
            },{
                id: 7,
                img: 'img/girl-img.png',
                title: 'Otite',
                general: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam massa quam. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisinuli.',
                causes: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam massa quam. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisinuli.',
                prevent: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam massa quam. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisinuli.'
            },{
                id: 8,
                img: 'img/girl-img.png',
                title: 'Paludisme',
                general: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam massa quam. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisinuli.',
                causes: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam massa quam. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisinuli.',
                prevent: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam massa quam. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisinuli.'
            },{
                id: 9,
                img: 'img/girl-img.png',
                title: 'Pied d’athlète',
                general: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam massa quam. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisinuli.',
                causes: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam massa quam. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisinuli.',
                prevent: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam massa quam. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisinuli.'
            },{
                id: 10,
                img: 'img/girl-img.png',
                title: 'Poliomyélite',
                general: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam massa quam. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisinuli.',
                causes: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam massa quam. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisinuli.',
                prevent: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam massa quam. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisinuli.'
            },{
                id: 11,
                img: 'img/girl-img.png',
                title: 'Rage',
                general: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam massa quam. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisinuli.',
                causes: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam massa quam. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisinuli.',
                prevent: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam massa quam. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisinuli.'
            },{
                id: 12,
                img: 'img/girl-img.png',
                title: 'Rhume et grippe',
                general: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam massa quam. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisinuli.',
                causes: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam massa quam. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisinuli.',
                prevent: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam massa quam. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisinuli.'
            },{
                id: 13,
                img: 'img/girl-img.png',
                title: 'Rage',
                general: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam massa quam. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisinuli.',
                causes: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam massa quam. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisinuli.',
                prevent: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam massa quam. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisinuli.'
            },{
                id: 14,
                img: 'img/girl-img.png',
                title: 'Poliomyélite',
                general: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam massa quam. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisinuli.',
                causes: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam massa quam. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisinuli.',
                prevent: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam massa quam. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisinuli.'
            }]
        },{
            id: 2,
            info: [{
                id: 0,
                img: 'img/girl-img.png',
                title: 'Maux de tête et céphalées',
                general: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam massa quam. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisinuli.',
                causes: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam massa quam. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisinuli.',
                prevent: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam massa quam. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisinuli.'
            },{
                id: 1,
                img: 'img/girl-img.png',
                title: 'Méningite',
                general: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam massa quam. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisinuli.',
                causes: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam massa quam. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisinuli.',
                prevent: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam massa quam. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisinuli.'
            },{
                id: 2,
                img: 'img/girl-img.png',
                title: 'Ménopause',
                general: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam massa quam. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisinuli.',
                causes: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam massa quam. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisinuli.',
                prevent: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam massa quam. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisinuli.'
            },{
                id: 3,
                img: 'img/girl-img.png',
                title: 'Morsures humaines ou animales',
                general: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam massa quam. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisinuli.',
                causes: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam massa quam. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisinuli.',
                prevent: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam massa quam. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisinuli.'
            },{
                id: 4,
                img: 'img/girl-img.png',
                title: 'Mycoses',
                general: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam massa quam. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisinuli.',
                causes: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam massa quam. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisinuli.',
                prevent: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam massa quam. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisinuli.'
            },{
                id: 5,
                img: 'img/girl-img.png',
                title: 'Nausée',
                general: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam massa quam. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisinuli.',
                causes: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam massa quam. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisinuli.',
                prevent: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam massa quam. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisinuli.'
            },{
                id: 6,
                img: 'img/girl-img.png',
                title: 'Obésité',
                general: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam massa quam. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisinuli.',
                causes: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam massa quam. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisinuli.',
                prevent: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam massa quam. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisinuli.'
            },{
                id: 7,
                img: 'img/girl-img.png',
                title: 'Otite',
                general: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam massa quam. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisinuli.',
                causes: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam massa quam. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisinuli.',
                prevent: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam massa quam. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisinuli.'
            },{
                id: 8,
                img: 'img/girl-img.png',
                title: 'Paludisme',
                general: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam massa quam. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisinuli.',
                causes: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam massa quam. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisinuli.',
                prevent: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam massa quam. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisinuli.'
            },{
                id: 9,
                img: 'img/girl-img.png',
                title: 'Pied d’athlète',
                general: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam massa quam. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisinuli.',
                causes: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam massa quam. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisinuli.',
                prevent: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam massa quam. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisinuli.'
            },{
                id: 10,
                img: 'img/girl-img.png',
                title: 'Poliomyélite',
                general: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam massa quam. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisinuli.',
                causes: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam massa quam. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisinuli.',
                prevent: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam massa quam. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisinuli.'
            },{
                id: 11,
                img: 'img/girl-img.png',
                title: 'Rage',
                general: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam massa quam. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisinuli.',
                causes: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam massa quam. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisinuli.',
                prevent: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam massa quam. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisinuli.'
            },{
                id: 12,
                img: 'img/girl-img.png',
                title: 'Rhume et grippe',
                general: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam massa quam. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisinuli.',
                causes: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam massa quam. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisinuli.',
                prevent: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam massa quam. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisinuli.'
            },{
                id: 13,
                img: 'img/girl-img.png',
                title: 'Rage',
                general: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam massa quam. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisinuli.',
                causes: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam massa quam. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisinuli.',
                prevent: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam massa quam. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisinuli.'
            },{
                id: 14,
                img: 'img/girl-img.png',
                title: 'Poliomyélite',
                general: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam massa quam. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisinuli.',
                causes: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam massa quam. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisinuli.',
                prevent: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam massa quam. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisinuli.'
            }]
        },{
            id: 3,
            info: [{
                id: 0,
                img: 'img/girl-img.png',
                title: 'Maux de tête et céphalées',
                general: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam massa quam. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisinuli.',
                causes: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam massa quam. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisinuli.',
                prevent: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam massa quam. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisinuli.'
            },{
                id: 1,
                img: 'img/girl-img.png',
                title: 'Méningite',
                general: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam massa quam. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisinuli.',
                causes: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam massa quam. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisinuli.',
                prevent: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam massa quam. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisinuli.'
            },{
                id: 2,
                img: 'img/girl-img.png',
                title: 'Ménopause',
                general: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam massa quam. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisinuli.',
                causes: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam massa quam. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisinuli.',
                prevent: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam massa quam. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisinuli.'
            },{
                id: 3,
                img: 'img/girl-img.png',
                title: 'Morsures humaines ou animales',
                general: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam massa quam. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisinuli.',
                causes: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam massa quam. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisinuli.',
                prevent: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam massa quam. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisinuli.'
            },{
                id: 4,
                img: 'img/girl-img.png',
                title: 'Mycoses',
                general: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam massa quam. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisinuli.',
                causes: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam massa quam. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisinuli.',
                prevent: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam massa quam. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisinuli.'
            },{
                id: 5,
                img: 'img/girl-img.png',
                title: 'Nausée',
                general: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam massa quam. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisinuli.',
                causes: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam massa quam. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisinuli.',
                prevent: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam massa quam. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisinuli.'
            },{
                id: 6,
                img: 'img/girl-img.png',
                title: 'Obésité',
                general: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam massa quam. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisinuli.',
                causes: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam massa quam. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisinuli.',
                prevent: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam massa quam. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisinuli.'
            },{
                id: 7,
                img: 'img/girl-img.png',
                title: 'Otite',
                general: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam massa quam. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisinuli.',
                causes: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam massa quam. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisinuli.',
                prevent: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam massa quam. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisinuli.'
            },{
                id: 8,
                img: 'img/girl-img.png',
                title: 'Paludisme',
                general: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam massa quam. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisinuli.',
                causes: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam massa quam. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisinuli.',
                prevent: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam massa quam. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisinuli.'
            },{
                id: 9,
                img: 'img/girl-img.png',
                title: 'Pied d’athlète',
                general: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam massa quam. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisinuli.',
                causes: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam massa quam. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisinuli.',
                prevent: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam massa quam. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisinuli.'
            },{
                id: 10,
                img: 'img/girl-img.png',
                title: 'Poliomyélite',
                general: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam massa quam. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisinuli.',
                causes: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam massa quam. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisinuli.',
                prevent: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam massa quam. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisinuli.'
            },{
                id: 11,
                img: 'img/girl-img.png',
                title: 'Rage',
                general: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam massa quam. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisinuli.',
                causes: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam massa quam. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisinuli.',
                prevent: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam massa quam. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisinuli.'
            },{
                id: 12,
                img: 'img/girl-img.png',
                title: 'Rhume et grippe',
                general: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam massa quam. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisinuli.',
                causes: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam massa quam. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisinuli.',
                prevent: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam massa quam. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisinuli.'
            },{
                id: 13,
                img: 'img/girl-img.png',
                title: 'Rage',
                general: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam massa quam. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisinuli.',
                causes: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam massa quam. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisinuli.',
                prevent: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam massa quam. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisinuli.'
            },{
                id: 14,
                img: 'img/girl-img.png',
                title: 'Poliomyélite',
                general: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam massa quam. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisinuli.',
                causes: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam massa quam. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisinuli.',
                prevent: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam massa quam. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisinuli.'
            }]
        }];

        return {
            all: function() {
                return maladiesListDetails;
            },
            //get: function (id) {
            //    return maladiesListDetails[id];
            //}
            get: function (id) {
                return maladiesListDetails[id]['info'];
            },
            full: function (id, sId) {
                return maladiesListDetails[id]['info'][sId];
            }
        };
    });