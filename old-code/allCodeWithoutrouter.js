(function () {
    'use strict';
    angular.module('app', [])
        .controller('AppController', ContFunction)
        .service('ListService', ListService)
        .service('WeightLossFilterService', WeightLossFilterService)
        .component('shoppingList', {
            templateUrl: 'shoppingList.html',
            controller: ShoppingListCompController,
            bindings: {
                items: '<',
                title: '@',
                onRemove: '&'
            }
        })
        .component('loadSpinner', {
            templateUrl: 'spinner.html',
            controller: SpinnerController
        });

    /**
     * 
     * publish-subscribe design pattren is implemented using the Angular event system
     * 
     * can publish event from anywhere in the systen and listen for those events
     * 
     * way to publish the event:
     * 1. $scope.$emit --> sends the event up the scope chain
     * 2. $scope.$broadcast --> sends the event down the scope chain
     * 3. $rootScope.$broadcast --> to broadcast to all nodes
     * 
     * to listen for the event, use the $scope.$on or $rootcase.$on --> passing to them the name of the event you're listing for
     * and the register function that should be executed when the event gets triggered
     * 
     * musr deregister listener when using $rootScope.$on --> hook it to destroyed method
     */

    SpinnerController.$inject = ['$rootScope'];
    function SpinnerController($rootScope) {
        var $ctrl = this;
        // looking for event from $broadcast
        // $rfootScope --> never distroyed until the entier app finished
        // protect from memory leak
        // $on --> register the event
        var cancelListener = $rootScope.$on('shoppinglist:processing', function (event, data) {
            console.log(data);
            console.log(event);

            if (data.on) {
                $ctrl.showSpinner = true;
            } else {
                $ctrl.showSpinner = true;
            }

        });
        $ctrl.$onDestroy = function () {
            cancelListener();
        };
    }

    ShoppingListCompController.$inject = ['$rootScope', '$element', '$q', 'WeightLossFilterService'];
    function ShoppingListCompController($rootScope, $element, $q, WeightLossFilterService) {

        var $ctrl = this;
        var totalItems;

        $ctrl.cookieInList = function () {
            for (var i = 0; i < $ctrl.items.length; i++) {
                var name = $ctrl.items[i].name;
                if (name.toLowerCase().indexOf("cookie") !== -1) {
                    return true;
                }
            };
            return false;
        }

        $ctrl.remove = function (myIndex) {
            $ctrl.onRemove({ index: myIndex });
        };

        $ctrl.$onInit = function () {
            totalItems = 0;
            console.log("$onInit");
        };

        $ctrl.$onChanges = function (changeObj) {
            console.log("$onChanges", changeObj);
        };
        // execute every time through the digest loop
        $ctrl.$doCheck = function () {
            if ($ctrl.items.length !== totalItems) {
                totalItems = $ctrl.items.length;

                // $rootscope --> because the code we want to execute is out of element scope
                // so we want to start from the root element
                //$broadcast --> event down 
                $rootScope.$broadcast('shoppinglist:processing', { on: true });
                var promise = [];
                for (var i = 0; i < $ctrl.items.length; i++) {
                    promise.push(WeightLossFilterService.checkName($ctrl.items[i].name));
                }

                $q.all(promise)
                    .then(function (result) {

                        var warningElm = $element.find("div"); // only look start at hte elem in the dom and below
                        warningElm.css('display', 'none');
                    })
                    .catch(function (result) {
                        var warningElm = $element.find("div"); // only look start at hte elem in the dom and below
                        warningElm.css('display', 'block');

                    })
                    .finally(function (result) {
                        $rootScope.$broadcast('shoppinglist:processing', { on: false });
                    });
            }
        }
    }

    WeightLossFilterService.$inject = ['$q', '$timeout']
    function WeightLossFilterService($q, $timeout) {
        var service = this;

        service.checkName = function (itemName) {
            // $q.defer() to create a Promise.
            var deferred = $q.defer();
            var result = {
                message: ""
            };

            $timeout(function () {
                if (itemName.toLowerCase().indexOf('cookie') === -1) {
                    // promise successfully passing to the result
                    deferred.resolve(result);
                } else {
                    result.message = "Stay away from cookies";
                    // promise unsuccessfully passing to the result
                    deferred.reject(result);
                }
            }, 3000);

            // return the result of the promise
            return deferred.promise;
        };

        service.checkQuantity = function (itemQuantity) {
            // $q.defer() to create a Promise.
            var deferred = $q.defer();
            var result = {
                message: ""
            };

            $timeout(function () {
                if (itemQuantity < 6) {
                    // promise successfully passing to the result
                    deferred.resolve(result);
                } else {
                    result.message = "That's too much";
                    // promise unsuccessfully passing to the result
                    deferred.reject(result);
                }
            }, 1000);

            return deferred.promise;
        };
    }


    //  ShoppingList.$inject = ['']
    function ShoppingList() {
        var ddo = {
            templateUrl: 'shoppingList.html', // good to restrict as E
            scope: {// isolate scope of the patent
                items: '<', // '<' on way binding whaches only the identity of the parent prop, not the porp inside the directive
                title: '@', // in case the name is the same we don't write it
                badRemove: '=',
                onRemove: '&' // reference binding -- allow to execute an expression in the contex of the parent scope
            },
            link: LinkFunction,
            transclude: true, // using ng-transclude in html
            controller: DirectiveController,// working same as controller / can we declare it in moudel and use it as string
            controllerAs: 'list', // lable of controller syntax -- use it in directive's template to refer to controller instance
            bindToController: true // attache declared scope prop to controller instance instaed of directly to $scope

        };
        return ddo;
    }

    function ListService() {

        var service = this;
        var items = [];

        service.addItem = function (itemName, quantity) {
            var item = {
                name: itemName,
                quantity: quantity
            };
            items.push(item);
        };
        service.removeItem = function (itemIndex) {
            items.splice(itemIndex, 1);
        };

        service.getItems = function () {
            return items;
        };

    }

    ContFunction.$inject = ['$scope'/*, '$filter', 'customFilter', '$timeout', 'ShoppingListService'*/, 'ListService'];

    // $filter --> service to create a filtering functionality used to formatting the data the eventually gets dispalyed to the user 
    function ContFunction($scope, /*$filter, customFilter, $timeout, ShoppingListService, $injector,*/ ListService) {

        var list = this;
        list.items = ListService.getItems(); //ShoppingListService.getItems();
        list.itemName = "";
        list.itemQuantity = "";

        var origTitle = "Shopping List";
        list.title = origTitle + " (" + list.items.length + " items )";
        list.warning = "COOKIE DETECTED!";
        //  list.maxItem = ShoppingListService.getMaxItem();
        list.addItem = function () {

            try {
                ListService.addItem(list.itemName, list.itemQuantity);
                // ShoppingListService.addItem(list.itemName, list.itemQuantity);
                list.title = origTitle + " (" + list.items.length + " items )";

            } catch (error) {
                list.errorMessage = error.message;
            }
        };

        // var.frunction --> without specifiy () -- the var fun can handle as funtuin
        list.removeItem = function (itemIndex) {
            this.lastRemoved = "Last item removed was " + this.items[itemIndex].name;
            ListService.removeItem(itemIndex);
            // ShoppingListService.removeItem(itemIndex);
            this.title = origTitle + " (" + list.items.length + " items )";

        };

    }

})();