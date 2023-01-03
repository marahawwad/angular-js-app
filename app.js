(function () {
    // protuct from mistakes, 
    // e.g.: when declare the variable to not used it globally we should to declare it by var, let, const
    // best practice to use it
    'use strict';

    // (name of the module , list of depencies)
    angular.module('app', [])

        // (name of the controller , function (defined the functionallty of the controller) )
        // $scope (scope service) --> generate from angular and it's middle obj between the view and view-module
        // holed the data to be available
        // any variable start with $ it refer to service
        // also we can create function and pass it to the controller it will act as the same
        // to make the code worked even after the minifcation we use either put the function in controller in array with passes parameters or using the $inject
        // .controller --> to register the created conroller
        // init the $scope, share code
        .controller('AppController', /*['$scope', '$filter', controller name] */ContFunction)
        // to create custom filer 1. defined the custom filter factory 
        // 2. register filter factory with module
        //3. inject it with nameFilter
        // .filter('custom', CustomFilter)
        // once we need too using it from html we don't need to inject it in controller injector
        // .filter('truth', TruthFilter)
        // here we used to right the busniess logic
        // it follow Singelton design  
        // inject it with the same name of declaration
        // service(name, function (treat as function constractor))
        // .service('serviceName', SomeServiceFunction)
        // allow us to produce any type of object function --> dynamiclly configurable at the time of using it
        // include the service --> is just more limited factory
        // injected funtion refers to whatever is returned in the factory function --> 1. can be object literal with prop that's a func creates smth
        // 2. can be function creates smth 
        //  .factory('factoryName', FactoryFunction)
        //provider --> most verbose but flexibled  custom configure the factory once at the bootstrapping of the app
        // provider.$get --> factory function --> directly attached to the provider instance --> create a new service
        // inject it to the controller
        .provider('ShoppingListService', ShoppingListServiceProvider)
        //(optional) invoke in the module instance that guaranteed to run before any services or controller
        // config the serviceProvider prop
        .config(Config);

    Config.$inject - ["ShoppingListServiceProvider"];
    function Config(ShoppingListServiceProvider) {
        // to set ant default config to be set before any running app
        ShoppingListServiceProvider.defaults.maxItem = 5;
    };



    /*, function ($scope) {
        $scope.name = "";
        $scope.totalValue = 0;
        /* $scope.sayHello = function () {
             return "Hello Dears";
         };*/

    /* $scope.dispalyNumeric = function (name) {
         var totalNumeric = calculateName(name);
         $scope.totalValue = totalNumeric;
     };

     function calculateName(string) {
         var totalStringValue = 0;
         for (var i = 0; i < string.length; i++) {
             totalStringValue += string.charCodeAt(i);
         }
         return totalStringValue;
     }
 });*/
    function ShoppingListService(maxItem) {
        var service = this;
        var items = [];

        service.addItem = function (itemName, quantity) {
            if ((maxItem === undefined) || (maxItem !== undefined) && (items.length < maxItem)) {
                var item = {
                    name: itemName,
                    quantity: quantity
                };
                items.push(item);
            } else {
                throw new Error("Max items (" + maxItem + ") reached");
            }
        };

        service.removeItem = function (itemIndex) {
            items.splice(itemIndex, 1);
        };

        service.getItems = function () {
            return items;
        };

        service.getMaxItem = function () {
            return maxItem;
        };
    };

    function ShoppingListServiceProvider() {
        var provider = this;

        provider.defaults = {
            maxItem: 10
        };

        provider.$get = function () {
            var shoppingList = new ShoppingListService(provider.defaults.maxItem);
            return shoppingList;
        };
    };

    ContFunction.$inject = [/*'$scope', '$filter', 'customFilter', '$timeout', */'ShoppingListService'];

    // $filter --> service to create a filtering functionality used to formatting the data the eventually gets dispalyed to the user 
    function ContFunction(/*$scope, $filter, customFilter, $timeout,*/ ShoppingListService/*, $injector*/) {

        var list = this;
        list.items = ShoppingListService.getItems();
        list.itemName = "";
        list.itemQuantity = "";
        list.maxItem = ShoppingListService.getMaxItem();
        list.addItem = function () {

            try {
                ShoppingListService.addItem(list.itemName, list.itemQuantity);
            } catch (error) {
                list.errorMessage = error.message;
            }
        };

        list.removeItem = function (itemIndex) {
            ShoppingListService.removeItem(itemIndex);
        };

        // $scope.name = "";
        // $scope.totalValue = 0;
        // $scope.stateOfBeing = "hungry";
        // $scope.foodCost = .45
        // $scope.onceCounter = 0;
        // $scope.counter = 0;
        // $scope.upper = function () {
        //     var UpCase = $filter('uppercase');
        //     $scope.name = UpCase($scope.name);
        // };

        // $scope.feedMe = function () {
        //     $scope.stateOfBeing = "fed";
        // };

        // $scope.sayMessage = function () {
        //     var msg = "Hello I like to eat healthy food";
        //     //return $filter('uppercase')(msg);
        //     return msg;
        // };

        // $scope.replaceMessage = function () {
        //     var msg = "Hello I like to eat healthy food";
        //     return customFilter(msg);
        // };

        // // $$ -- indicative of smth that is internal to angularjs/ never interact with this directly
        // $scope.showNumberOfWatchers = function () {
        //     console.log("# of Watcher: ", $scope.$$watchersCount);
        // }

        // $scope.countOnce = function () {
        //     $scope.onceCounter = 1
        // }

        // setTimeout here the counter is out of angular context
        // so the digest cycle didn't watch, do we need to do in manually using $scope.$digest();
        // not good cause the exception or any error will not be visible to angularjs
        // so using the $scope.$apply(function(){}) called $scope.$digest() automaticlly
        // best one is to find angular specific service that handle the same functionality
        // $scope.upCounter = function () {
        //     $timeout(function () {
        //         $scope.counter++;
        //         console.log("Incremented!");
        //     }, 2000);

        /* setTimeout(function () {
             $scope.$apply(function () {
                 $scope.counter++;
                 console.log("Incremented!");
             });
             //$scope.$digest();
         }, 2000);*/
    }

    // using this way to watch every proprites 
    /* $scope.$watch(function () {
         console.log("Digest Loop Fired");
     });*/

    // can do the watcher manually by using $watch function from $scope
    // take 2 argumants -- first -- namr of property want to watch
    // second -- function with 2 params (newValue, oldValue)
    // this called the Digest cycle (Dirty checking)--> angular do it twoice to check if there are any change happend to the properties,
    // and second to verfiy that nothing else has changed in the entire list
    // not good practice don't do it in controller

    /**
     * Several ways to set up the watchers
     * 1. $scope.$watch
     * 2. {{some prop}}
     * 3. <input ... ng-model ="someProp">
     */

    /*$scope.$watch('onceCounter', function (newValue, oldValue) {
        console.log("onceCounter old value: ", oldValue);
        console.log("onceCounter new value: ", newValue);
    });

    $scope.$watch('counter', function (newValue, oldValue) {
        console.log("counter old value: ", oldValue);
        console.log("counter new value: ", newValue);
    });*/


    /**
     * binding kinds:
     * 1. 2-way -- ng-model = 'prop'
     * 2. 1-way -- {{prop}}
     * 3. 1-time -- {{::prop}} -- once initialized remove the watcher
     * 
     */

    /**
     * 
     * using ng-reapet (item in collection) to iterat over the collection
     * $index --> exposed from ng-reapet
     */

    /**
     * filter in collection --> to filttering over the elem. in the collection
     * can using it from html (| filter : expresion ) or function in js
     */

    /**
     * prototyple inheritance --> Object.create(parent); using to inhiernt value from the parent ($scope)
     * scope inheritance --> the scope inherint from the up scope level 
     * controller as syntax --> Conrtoller as ctrl1 create prop 'ctrl' in $scope 
     */

    // function Dog(){} --> this indicate a constructor function
    //};

    // CustomFilter Factory
    // function CustomFilter() {
    //     return function (input) {
    //         input = input || "";
    //         input = input.replace("like", "love");
    //         return input;
    //     };
    // }

    // function TruthFilter() {
    //     return function (input, target, replace) {
    //         input = input || "";
    //         input = input.replace(target, replace);
    //         return input;
    //     };
    // }



    // $injector --> witch service to inject to witch argument on the controller or whatever 
    // what is the param that passed -- to annotate
    //console.log($injector.annotate(ContFunction));

    /*function AnnonateMe(name, job, blah) {
        return 'Blah!';
    }
    console.log(AnnonateMe);*/

    // Minification --> removing all unnecessary chars from source code without changing its functionality
    // uglyfy code --> used to mimize the file size

})();