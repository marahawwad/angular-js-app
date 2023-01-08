(function () {
    'use strict';
    // ui.router indendent concept for URL mapping and UI state representation
    angular.module('app', ['ui.router']);

    angular.module('app')
        .config(RoutesConfig);

    RoutesConfig.$inject = ['$stateProvider', '$urlRouterProvider'];
    function RoutesConfig($stateProvider, $urlRouterProvider) {

        // redirect to tab1 if no other URL matches
        $urlRouterProvider.otherwise('/tab1');

        //set up states
        $stateProvider.state('tab1', { // name , congifuration obj
            url: '/tab1',
            templateUrl: 'tab1.html'
            //template: '<div> This is Tab 1 </div>'
        })
            .state('tab2', { // name , congifuration obj
                url: '/tab2',
                templateUrl: 'tab2.html'
                // template: '<div> This is Tab 2 </div>'
            });
    }
})();