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
                    items: ['Service', function (Service) { // this will be injected to the controller with the same name of key  , must inject it in controller
                        // in case of promise the routes will not done until the promise resolved , in case if the promise rejected it will not be routes to the new state
                        return Service.getData();
                    }]
                }
            })
            .state('itemDetail', {
                url: 'item-detail/{itemId}' // the name of param the will be used during the app 
                , templateUrl: ''
                , controller: ''
                , reslove: { // the name of param the will be used during the app 
                    item: ['$stateParams', 'service', function ($stateParams, service) {// this will be inject to the controller // using in the html stateNme({paramName: value})
                        return service.getItems()
                            .then(function (items) {
                                return items[$stateParams.itemId]; // $stateParams.paramName that declate in the URL
                            });
                    }]
                }
            }).state('mainList.itemDetail', {// child state inherit hte state of the parent -- here we show the data in same page 
                url: 'item-detail/{itemId}' // the name of param the will be used during the app  , this optional [in case not e3xist will not cuase any effect in the url]
                , templateUrl: '' // in html we replace the call by parent.child , and call <ui-view>
                , controller: '' // we will inject the parent resolve data and $stateParams to the controller
                /* , reslove: {
                     item: ['$stateParams', 'service', function ($stateParams, service) {
                         // using in the html stateNme({paramName: value})
                         return service.getItems()
                             .then(function (items) {
                                 return items[$stateParams.itemId]; // $stateParams.paramName that declate in the URL
                             });
                     }]
                 }*/
                , params: { // in case the url not exist we can the params
                    itemId: null
                }
            });

        /**
         * all ui-router events are fired on the $rootScope
         * 
         * $stateChangeStart --> file when state change transition begind 
         *     event.preventDefault() --> to prevent the transition from occurring
         * $stateChangeSuccess --> fired once the state transition is complete
         * $stateChangeError --> fired when an error occurs during trasition -- cause the error not shown in the consloe
         * 
         */
    }
})();