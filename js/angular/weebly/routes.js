angular.module('Weebly')
    .config(function($urlRouterProvider, $stateProvider, $uiViewScrollProvider) {
        $urlRouterProvider.otherwise('/');
        $uiViewScrollProvider.useAnchorScroll();
        $stateProvider
            .state('index', {
                url: '/',
                views: {
                    'weebly-main': {
                        controller: 'WeeblyMainCtrl',
                        templateUrl: 'weebly/partials/index.html'
                    }
                }
            });
    });
