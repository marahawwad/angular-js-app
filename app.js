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
        .controller('AppController', /*['$scope', '$filter', controller name] */ContFunction);

    ContFunction.$inject = ['$scope', '$filter'];


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

    // $filter --> service to create a filtering functionality used to formatting the data the eventually gets dispalyed to the user 
    function ContFunction($scope, $filter/*, $injector*/) {
        $scope.name = "";
        $scope.totalValue = 0;
        $scope.stateOfBeing = "hungry";
        $scope.upper = function () {
            var UpCase = $filter('uppercase');
            $scope.name = UpCase($scope.name);
        };

        $scope.feedMe = function () {
            $scope.stateOfBeing = "fed";
        };
    };

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