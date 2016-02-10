angular.module('starter.controllers', ['ngOpenFB'])

    .controller('SliderCtrl', function ($scope, $state) {

        if (window.localStorage.getItem('name') != null){
            $state.go("main.tips");
        }

        $scope.openLogin = function() {
            $state.go("Login");
        }

    })

    .controller('LoginCtrl', function ($scope, $ionicModal, $timeout, $ionicPopup, $state, $http, $ionicLoading, ngFB) {
        $scope.usersData = [];

        $scope.fbLogin = function () {

            ngFB.login({scope: 'email,user_about_me,publish_actions'}).then(
                function (response) {
                    if (response.status === 'connected') {
                        ngFB.api({
                            path: '/me',
                            params: {fields: 'id,name, age_range, gender, picture'}
                        }).then(
                            function (user) {
                                $scope.data = {'fb_id': user.id,'login': user.name, 'age': user.age_range.min, 'sex': user.gender, 'picture': user.picture.data.url};

                                var link = 'http://ct55373.tmweb.ru/buslik/healthyBack/loginFB.php';

                                $http.get(link, {params: $scope.data}).then(function(resp) {
                                    if (resp.data.success == null) {
                                        $scope.erLogin = function() {
                                            $ionicPopup.alert({
                                                template: 'Email invalide ou le numéro de téléphone mobile.',
                                                okText: 'Continuer',
                                                okType: 'button button-clear m-popup-buttons'
                                            });
                                        };

                                        $scope.data = {};

                                        $scope.erLogin();
                                    } else {
                                        $scope.data = {};

                                        function saveUserData(name, picture) {
                                            window.localStorage.setItem('name', name);
                                            window.localStorage.setItem('picture', picture);
                                        }

                                        saveUserData(user.name, user.picture.data.url);

                                        $state.go("main.tips");
                                    }
                                }, function(err) {
                                    console.error('ERR', err);
                                    // err.status will contain the status code
                                })
                            },
                            function (error) {
                                alert('Facebook error: ' + error.error_description);
                            });
                    } else {
                        $ionicPopup.alert({
                            template: 'Facebook login failed ',
                            okText: 'Continuer',
                            okType: 'button button-clear m-popup-buttons'
                        });
                    }
                });
        };

        $scope.openRegister = function() {
            $state.go("Register");
        };

        $scope.loginUser = function(data) {

            $scope.showLoading = function() {
                $ionicLoading.show();
            };

            $scope.showLoading();

            $scope.hideLoading = function() {
                $ionicLoading.hide();
            };

            if (data != 'undefined') {
                $scope.data = {'login': data.login, 'phone': data.phone};

                var link = 'http://ct55373.tmweb.ru/buslik/healthyBack/login.php';

                $http.get(link, {params: {'login': data.login, 'phone': data.phone}}).then(function(resp) {
                    if (resp.data.success == null) {
                        $scope.hideLoading();
                        $scope.erLogin = function() {
                            $ionicPopup.alert({
                                template: 'Email invalide ou le numéro de téléphone mobile.',
                                okText: 'Continuer',
                                okType: 'button button-clear m-popup-buttons'
                            });
                        };

                        $scope.data = {};

                        $scope.erLogin();
                    } else {
                        $scope.data = {};
                        $scope.hideLoading();

                        function saveUserData(name, picture) {
                            window.localStorage.setItem('name', name);
                            window.localStorage.setItem('picture', picture);
                        }

                        saveUserData(data.login, 'img/menu-avatar.png');

                        $state.go("main.tips");
                    }
                }, function(err) {
                    console.error('ERR', err);
                    // err.status will contain the status code
                })

            } else {
                $scope.hideLoading();
                $scope.erLogin = function() {
                    $ionicPopup.alert({
                        template: 'Email invalide ou le numéro de téléphone mobile.',
                        okText: 'Continuer',
                        okType: 'button button-clear m-popup-buttons'
                    });
                };

                $scope.data = {};

                $scope.erLogin();
            }

        };


    })

    .controller('TipsCtrl', function ($scope, tips, $ionicLoading, $timeout, $ionicFilterBar) {
        $scope.showLoading = function() {
            $ionicLoading.show();
        };

        $scope.hideLoading = function() {
            $ionicLoading.hide();
        };

        $scope.showLoading();

        $timeout(function() {
            $scope.hideLoading();
        }, 1500);

        $timeout(function() {
            $scope.tips = tips.all();
        }, 1501);

        // Filter part

        var filterBarInstance;

        $scope.showFilterBar = function () {
            filterBarInstance = $ionicFilterBar.show({
                items: $scope.tips,
                update: function (filteredItems, filterText) {
                    $scope.tips = filteredItems;
                    if (filterText) {
                        console.log(filterText);
                    }
                }
            });
        };

        $scope.refreshItems = function () {
            if (filterBarInstance) {
                filterBarInstance();
                filterBarInstance = null;
            }

            $timeout(function () {
                tips.all();
                $scope.$broadcast('scroll.refreshComplete');
            }, 1000);
        };

        // END Filter part

    })

    .controller('mainCtrl', function($scope, $location, $ionicSideMenuDelegate, $state, $ionicPopup, $rootScope, $timeout, $ionicActionSheet, $cordovaSocialSharing) {

        //$scope.toggleLeftMenu = function() {
        //    $ionicSideMenuDelegate.toggleLeft();
        //};
        //

        $scope.shareAnywhere = function() {
            $cordovaSocialSharing.share('Message, subject, image and link', 'The subject', 'https://www.google.nl/images/srpr/logo4w.png', 'http://www.x-services.nl');
        };

        $scope.shareSMS = function() {
            $cordovaSocialSharing.shareViaSMS('My cool message', null /* see the note below */, function(msg) {console.log('ok: ' + msg)}, function(msg) {alert('error: ' + msg)});
        };

        $scope.showDetails = function() {
            $ionicActionSheet.show({
                buttons: [{
                    text: '<i class="icon in-partager"></i> Partager'
                },
                    {
                        text: '<i class="icon in-health-center"></i> Aller à un centre de santé'
                    },
                    {
                        text: '<i class="icon in-subscribe"></i> Souscrire pour Plus d’Astuces'
                    }
                ],

                buttonClicked: function(index){

                    if (index==0) {

                        $scope.partagerActionSheet = function(){
                            $ionicActionSheet.show({
                                cssClass: 'partagerAS',
                                buttons: [
                                    {text: '<i class="icon google-ico"></i><br /><div class="text">Gmail</div>'},
                                    {text: '<i class="icon hangout-ico"></i><br /><div class="text">Hangout</div>'},
                                    {text: '<i class="icon gplus-ico"></i><br /><div class="text">Google+</div>'},
                                    {text: '<i class="icon mail-ico"></i><br /><div class="text">Mail</div>'},
                                    {text: '<i class="icon message-ico"></i><br /><div class="text">Message</div>'},
                                    {text: '<i class="icon more-ico"></i><br /><div class="text">More</div>'}
                                ],
                                titleText: 'Partager via',
                                cancelText: 'Cancel',
                                cancel: function() {
                                    return false;
                                },
                                buttonClicked: function(index){
                                    if (index==0) {
                                        $scope.shareAnywhere();
                                    }
                                    if (index==1) {
                                        console.log("index="+index);
                                        return true;
                                    }
                                    if (index==4) {
                                        $scope.shareSMS();
                                    }
                                }
                            })
                        };

                        $scope.partagerActionSheet();

                        return true;
                    }
                    if (index==1) {

                        $location.path('main/nouseful/1');

                        return true;
                    }
                    if (index==2) {

                        $scope.SubscribeConfirm = function() {
                            var SubscribeConfirm = $ionicPopup.confirm({
                                template: 'Vous avez désiré souscrire au service « Plus d’Astuces ». Vous serez donc redirigé vers l’application Messages de votre téléphone pour achever votre souscription.',
                                okText: 'ACCEPTER',
                                okType: 'button button-clear m-popup-buttons',
                                cancelText: 'REFUSER',
                                cancelType: 'button button-clear m-popup-buttons'
                            });

                            SubscribeConfirm.then(function(res) {
                                if(res) {
                                    console.log('Click CONTINUER');
                                } else {
                                    console.log('Click REVENIR');
                                }
                            });
                        };

                        $scope.SubscribeConfirm();

                        return true;
                    }
                }
            });
        };

        $scope.nousefulDet = function() {
            $timeout(function() {
                $state.go('main.nouseful');
            }, 1);
            $timeout(function() {
                $state.go('main.nouseful-detail', {
                    nousefulId: 2
                });
            }, 2);
        };

        $scope.SubscribeConfirm = function() {
            var SubscribeConfirm = $ionicPopup.confirm({
                template: 'Vous avez désiré souscrire au service « Plus d’Astuces ». Vous serez donc redirigé vers l’application Messages de votre téléphone pour achever votre souscription.',
                okText: 'ACCEPTER',
                okType: 'button button-clear m-popup-buttons',
                cancelText: 'REFUSER',
                cancelType: 'button button-clear m-popup-buttons'
            });

            SubscribeConfirm.then(function(res) {
                if(res) {
                    console.log('Click CONTINUER');
                } else {
                    console.log('Click REVENIR');
                }
            });
        };


        $scope.$on('$stateChangeSuccess', function(){
            $scope.userName = window.localStorage.getItem('name');
            $scope.userPicture = window.localStorage.getItem('picture');
        });

        $scope.$on('$stateChangeSuccess', function(){
            if ($location.path() === '/main/tips' || $location.path() === '/main/diseases' || $location.path() === '/main/nouseful'){
                $scope.leftMenuShow = '';
            } else {
                $scope.leftMenuShow = 'hide-icon-menu';
            }
        });

        $scope.openedButtonClass = '';
        $scope.openedClass = 'closed';

        $scope.openDrawer = function() {
            $scope.openedClass = 'opened';
            $scope.openedButtonClass = 'activated';
        };

        $scope.closeDrawer = function() {
            $scope.openedClass = 'closed';
            $scope.openedButtonClass = '';
        };

        $scope.logOut = function() {
            $scope.closeDrawer();
            $scope.userName = '';
            $scope.userPicture = '';
            window.localStorage.removeItem('name');
            window.localStorage.removeItem('picture');
            $state.go('Login');
        };

        //// Filter part
        //
        //var filterBarInstance;
        //
        //function getItems () {
        //    var items = [];
        //    for (var x = 1; x < 2000; x++) {
        //        items.push({text: 'This is item number ' + x + ' which is an ' + (x % 2 === 0 ? 'EVEN' : 'ODD') + ' number.'});
        //    }
        //    $scope.items = items;
        //}
        //
        //getItems();
        //
        //$scope.showFilterBar = function () {
        //    filterBarInstance = $ionicFilterBar.show({
        //        items: $scope.items,
        //        update: function (filteredItems, filterText) {
        //            $scope.items = filteredItems;
        //            if (filterText) {
        //                console.log(filterText);
        //            }
        //        }
        //    });
        //};
        //
        //$scope.refreshItems = function () {
        //    if (filterBarInstance) {
        //        filterBarInstance();
        //        filterBarInstance = null;
        //    }
        //
        //    $timeout(function () {
        //        getItems();
        //        $scope.$broadcast('scroll.refreshComplete');
        //    }, 1000);
        //};
        //
        //// END Filter part

    })

    .controller('MainController', function($scope, $timeout, $ionicFilterBar){
        // Filter part

        var filterBarInstance;

        function getItems () {
            var items = [];
            for (var x = 1; x < 2000; x++) {
                items.push({text: 'This is item number ' + x + ' which is an ' + (x % 2 === 0 ? 'EVEN' : 'ODD') + ' number.'});
            }
            $scope.items = items;
        }

        getItems();

        $scope.showFilterBar = function () {
            filterBarInstance = $ionicFilterBar.show({
                items: $scope.items,
                update: function (filteredItems, filterText) {
                    $scope.items = filteredItems;
                    if (filterText) {
                        console.log(filterText);
                    }
                }
            });
        };

        $scope.refreshItems = function () {
            if (filterBarInstance) {
                filterBarInstance();
                filterBarInstance = null;
            }

            $timeout(function () {
                getItems();
                $scope.$broadcast('scroll.refreshComplete');
            }, 1000);
        };

        // END Filter part
    })

    .controller('navBarCtrl', function ($scope, $ionicActionSheet, $ionicPopup, $location, $cordovaSocialSharing) {


    })

    .controller('DiseasesCtrl', function ($scope, diseases, $ionicLoading, $timeout, $ionicFilterBar) {

        $scope.showLoading = function() {
            $ionicLoading.show();
        };

        $scope.hideLoading = function() {
            $ionicLoading.hide();
        };

        $scope.showLoading();

        $timeout(function() {
            $scope.hideLoading();
        }, 1500);

        $timeout(function() {
            $scope.diseases = diseases.all();
        }, 1501);

        // Filter part

        var filterBarInstance;

        $scope.showFilterBar = function () {
            filterBarInstance = $ionicFilterBar.show({
                items: $scope.diseases,
                update: function (filteredItems, filterText) {
                    $scope.diseases = filteredItems;
                    if (filterText) {
                        console.log(filterText);
                    }
                }
            });
        };

        $scope.refreshItems = function () {
            if (filterBarInstance) {
                filterBarInstance();
                filterBarInstance = null;
            }

            $timeout(function () {
                diseases.all();
                $scope.$broadcast('scroll.refreshComplete');
            }, 1000);
        };

        // END Filter part

    })

    .controller('DiseasesDetailsCtrl', function ($scope, diseases, maladiesListDetails, $ionicLoading, $timeout, $stateParams, $ionicFilterBar) {
        $scope.disease = diseases.get($stateParams.diseasesId);

        $scope.showLoading = function() {
            $ionicLoading.show();
        };

        $scope.hideLoading = function() {
            $ionicLoading.hide();
        };

        $scope.showLoading();

        $timeout(function() {
            $scope.maladiesListDetalis = maladiesListDetails.get($stateParams.diseasesId);
        }, 1501);

        $timeout(function() {
            $scope.hideLoading();
        }, 1500);

        // Filter part

        var filterBarInstance;

        $scope.showFilterBar = function () {
            filterBarInstance = $ionicFilterBar.show({
                items: $scope.maladiesListDetalis,
                update: function (filteredItems, filterText) {
                    $scope.maladiesListDetalis = filteredItems;
                    if (filterText) {
                        console.log(filterText);
                    }
                }
            });
        };

        $scope.refreshItems = function () {
            if (filterBarInstance) {
                filterBarInstance();
                filterBarInstance = null;
            }

            $timeout(function () {
                maladiesListDetails.get($stateParams.diseasesId);
                $scope.$broadcast('scroll.refreshComplete');
            }, 1000);
        };

        // END Filter part

    })

    .controller('DiseasesFullCtrl', function($scope , diseases, maladiesListDetails, $ionicLoading, $timeout, $stateParams) {

        $scope.disease = diseases.get($stateParams.diseasesId);

        $scope.fullInfo = maladiesListDetails.full($stateParams.diseasesId,$stateParams.diseasesfullId);

        $scope.groups = [];

        $scope.groups[0] = {
            name: 'Présentation générale',
            item: $scope.fullInfo.general
        };

        $scope.groups[1] = {
            name: 'Causes',
            item: $scope.fullInfo.causes
        };

        $scope.groups[2] = {
            name: 'Comment prévenir',
            item: $scope.fullInfo.prevent
        };

        $scope.toggleGroup = function(group) {
            if ($scope.isGroupShown(group)) {
                $scope.shownGroup = null;
            } else {
                $scope.shownGroup = group;
            }
        };
        $scope.isGroupShown = function(group) {
            return $scope.shownGroup === group;
        };

    })

    .controller('NousefulCtrl', function ($scope, nousefuls, $ionicLoading, $timeout, $ionicFilterBar) {

        $scope.showLoading = function() {
            $ionicLoading.show();
        };

        $scope.hideLoading = function() {
            $ionicLoading.hide();
        };

        $scope.showLoading();

        $timeout(function() {
            $scope.hideLoading();
        }, 1500);

        $timeout(function() {
            $scope.nousefuls = nousefuls.all();
        }, 1501);

        // Filter part

        var filterBarInstance;

        $scope.showFilterBar = function () {
            filterBarInstance = $ionicFilterBar.show({
                items: $scope.nousefuls,
                update: function (filteredItems, filterText) {
                    $scope.nousefuls = filteredItems;
                    if (filterText) {
                        console.log(filterText);
                    }
                }
            });
        };

        $scope.refreshItems = function () {
            if (filterBarInstance) {
                filterBarInstance();
                filterBarInstance = null;
            }

            $timeout(function () {
                nousefuls.all();
                $scope.$broadcast('scroll.refreshComplete');
            }, 1000);
        };

        // END Filter part

    })

    .controller('NousefulDetailCtrl', function($scope, $ionicHistory, $stateParams, nousefuls, nousefulsDetails, $ionicPopup, $ionicLoading, $timeout, $ionicFilterBar) {

        $scope.myGoBack = function() {
            $ionicHistory.goBack();
        };

        $scope.nouseful = nousefuls.get($stateParams.nousefulId);

        $scope.showLoading = function() {
            $ionicLoading.show();
        };

        $scope.hideLoading = function() {
            $ionicLoading.hide();
        };

        $scope.showLoading();

        $timeout(function() {
            $scope.hideLoading();
        }, 1500);

        $timeout(function() {
            $scope.nousefulsDelails = nousefulsDetails.get(nousefuls.get($stateParams.nousefulId)['id']);
        }, 1501);

        // Filter part

        var filterBarInstance;

        $scope.showFilterBar = function () {
            filterBarInstance = $ionicFilterBar.show({
                items: $scope.nousefulsDelails,
                update: function (filteredItems, filterText) {
                    $scope.nousefulsDelails = filteredItems;
                    if (filterText) {
                        console.log(filterText);
                    }
                }
            });
        };

        $scope.refreshItems = function () {
            if (filterBarInstance) {
                filterBarInstance();
                filterBarInstance = null;
            }

            $timeout(function () {
                nousefulsDetails.get(nousefuls.get($stateParams.nousefulId)['id']);
                $scope.$broadcast('scroll.refreshComplete');
            }, 1000);
        };

        // END Filter part

        $scope.NousefulConfirm = function() {
            var NousefulConfirm = $ionicPopup.confirm({
                template: 'Pour accéder aux Pharmacies de garde, vous devez souscrire au 712. Vous serez donc redirigé vers l’application Appel de votre téléphone pour achever votre souscription.',
                okText: 'CONTINUER',
                okType: 'button button-clear m-popup-buttons',
                cancelText: 'REVENIR',
                cancelType: 'button button-clear m-popup-buttons'
            });

            NousefulConfirm.then(function(res) {
                if(res) {
                    console.log('Click CONTINUER');
                } else {
                    console.log('Click REVENIR');
                }
            });
        };

    })

    .controller('RegisterCtrl', function($scope, $state, $ionicModal, $ionicPopup, $http, $ionicLoading, ngFB) {
        $scope.openLogin = function() {
            $state.go("Login");
        };

        $scope.hideLoading = function() {
            $ionicLoading.hide();
        };

        $scope.showLoading = function() {
            $ionicLoading.show();
        };

        $scope.dateYears = [];
        var begin = 1900;
        var end = 2016;

        while (end >= begin) {
            $scope.dateYears.push({
                'year': end
            });

            end = end - 1;
        };

        $scope.registerUser = function(data) {

            $scope.showLoading();

            if (data != 'undefined') {
                $scope.data = {'login': data.login, 'phone': data.phone, 'age': data.age, 'sex': data.sex};

                if (data.login == null || data.phone == null || data.age == null || data.sex == null) {
                    $scope.hideLoading();
                    $scope.erLogin = function() {
                        $ionicPopup.alert({
                            template: 'Email invalide ou le numéro de téléphone mobile.',
                            okText: 'Continuer',
                            okType: 'button button-clear m-popup-buttons'
                        });
                    };

                    $scope.erLogin();

                    $scope.data = {};

                } else {

                    var link = 'http://ct55373.tmweb.ru/buslik/healthyBack/register.php';

                    $http.get(link, {params: $scope.data}).then(function(resp) {

                        if (resp.data.success == 0) {
                            $scope.hideLoading();
                            $scope.erLogin = function() {
                                $ionicPopup.alert({
                                    template: 'Email invalide ou le numéro de téléphone mobile.',
                                    okText: 'Continuer',
                                    okType: 'button button-clear m-popup-buttons'
                                });
                            };

                            $scope.data = {};

                            $scope.erLogin();
                        } else {
                            $scope.data = {};
                            $scope.hideLoading();
                            $state.go("main.tips");
                        }
                    }, function(err) {
                        console.error('ERR', err);
                        // err.status will contain the status code
                    })

                }

            } else {
                $scope.hideLoading();
                $scope.erLogin = function() {
                    $ionicPopup.alert({
                        template: 'Email invalide ou le numéro de téléphone mobile.',
                        okText: 'Continuer',
                        okType: 'button button-clear m-popup-buttons'
                    });
                };

                $scope.data = {};

                $scope.erLogin();
            }
        }

        $scope.fbRegister = function () {

            ngFB.login({scope: 'email,user_about_me,publish_actions'}).then(
                function (response) {
                    if (response.status === 'connected') {
                        ngFB.api({
                            path: '/me',
                            params: {fields: 'id,name, age_range, gender, picture'}
                        }).then(
                            function (user) {
                                $scope.data = {'fb_id': user.id,'login': user.name, 'age': user.age_range.min, 'sex': user.gender, 'picture': user.picture.data.url};

                                var link = 'http://ct55373.tmweb.ru/buslik/healthyBack/loginFB.php';

                                $http.get(link, {params: $scope.data}).then(function(resp) {
                                    if (resp.data.success == null) {
                                        $scope.erLogin = function() {
                                            $ionicPopup.alert({
                                                template: 'Email invalide ou le numéro de téléphone mobile.',
                                                okText: 'Continuer',
                                                okType: 'button button-clear m-popup-buttons'
                                            });
                                        };

                                        $scope.data = {};

                                        $scope.erLogin();
                                    } else {
                                        $scope.data = {};

                                        function saveUserData(name, picture) {
                                            window.localStorage.setItem('name', name);
                                            window.localStorage.setItem('picture', picture);
                                        }

                                        saveUserData(user.name, user.picture.data.url);

                                        $state.go("main.tips");
                                    }
                                }, function(err) {
                                    console.error('ERR', err);
                                    // err.status will contain the status code
                                })
                            },
                            function (error) {
                                alert('Facebook error: ' + error.error_description);
                            });
                    } else {
                        $ionicPopup.alert({
                            template: 'Facebook login failed ',
                            okText: 'Continuer',
                            okType: 'button button-clear m-popup-buttons'
                        });
                    }
                });
        };

    })