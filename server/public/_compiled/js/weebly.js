angular.module('Weebly', ['Weebly.templates', 'ui.router', 'ui.bootstrap'])
	.config(function ($locationProvider, $anchorScrollProvider) {
		$locationProvider.html5Mode(true);
        $anchorScrollProvider.disableAutoScrolling();
    });;angular.module('Weebly')
    .controller('WeeblyMainCtrl', function ($scope) {
        console.log($scope);
        
    });;angular.module('Weebly')
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
