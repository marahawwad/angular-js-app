(function () {
    'use strict';

    angular.module('app')
        .config(RoutesConfig);

    RoutesConfig.$inject = ['$stateProvider', '$urlRouterProvider'];
    function RoutesConfig($stateProvider, $urlRouterProvider) {

        // redirect to home if no other URL matches
        $urlRouterProvider.otherwise('/');

        //set up states
        $stateProvider
            .state('home', { // name , congifuration obj
                url: '/',
                templateUrl: 'index.html'
                //template: '<div> This is Tab 1 </div>'
            }).state('mainList', { // name , congifuration obj
                url: '/main-list',
                templateUrl: 'shoppingList.html'
                //template: '<div> This is Tab 1 </div>'
                , controller: 'contrlooer as syntax' // can we declare the controller responsible for the state in the state 
                , reslove: { // some case we ned to retrive data and pass it to the next satae before the routing
                    data: ['Service', function (Service) { // this will be injected to the controller with the same name of key  , must inject it in controller
                        // in case of promise the routes will not done until the promise resolved , in case if the promise rejected it will not be routes to the new state
                        return Service.getData();
                    }]
                }
            });
    }
})();