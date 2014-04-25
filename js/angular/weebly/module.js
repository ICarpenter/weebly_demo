angular.module('Weebly', ['Weebly.templates', 'ui.router', 'ui.bootstrap'])
	.config(function ($locationProvider, $anchorScrollProvider) {
		$locationProvider.html5Mode(true);
        $anchorScrollProvider.disableAutoScrolling();
    });