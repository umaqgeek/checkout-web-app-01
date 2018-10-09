// const APP_BASE_URL = 'http://localhost:8081/';
const APP_BASE_URL = 'https://sja-checkout-core-server.herokuapp.com/';

var app = angular.module('checkoutApp', []);

app.controller('checkoutCtrl', function($scope, $http, $templateCache, $window) {

  $templateCache.removeAll();
  $scope.items = {
    display: [],
    data: []
  };
  $scope.loading = true;

  $http.get(APP_BASE_URL + 'advertisements')
    .then(function (response) {
    $scope.advertisements = response.data;
  });

  $http.get(APP_BASE_URL + 'customers')
    .then(function (response) {
      let newArr = [];
      response.data.forEach(function (item) {
        item.id = item.id.charAt(0).toUpperCase() + item.id.substr(1).toLowerCase();
        newArr.push(item);
      });
      $scope.customers = newArr;
  });

  $scope.storeData = function (itemId) {
    $scope.items.data.push(itemId);
    if ($scope.items.display.length > 0) {
      var foundObj = $scope.items.display.filter(function (item) {
        return item.item === itemId;
      });
      if (foundObj.length <= 0) {
        $scope.items.display.push({
          item: itemId,
          count: 1
        });
      } else {
        var objIndex = $scope.items.display.findIndex((obj => obj.item == itemId));
        $scope.items.display[objIndex].count += 1;
      }
    } else {
      $scope.items.display.push({
        item: itemId,
        count: 1
      });
    }
  }

  $scope.removeData = function (itemId) {
    if ($scope.items.data.indexOf(itemId) >= 0) {
      $scope.items.data.splice($scope.items.data.indexOf(itemId), 1);
    }
    var indexObj = $scope.items.display.findIndex(function (obj) {
      return obj.item === itemId;
    });
    if (indexObj >= 0) {
      if ($scope.items.display[indexObj].count === 1) {
        $scope.items.display.splice(indexObj, 1);
      } else {
        $scope.items.display[indexObj].count -= 1;
      }
    }
  }

  $scope.calculateData = function () {
    $http({
      method: 'POST',
      url: APP_BASE_URL + 'calculate',
      cache: $templateCache,
      data: {
        'customer': $scope.customer,
        'skus': $scope.items.data
      }
    })
    .then(function(response) {
      $scope.result = response.data.total;
      $scope.resultFull = response.data;
    }, function(response) {
      $scope.result = response;
    });
  }

  $scope.refreshPage = function () {
    $window.location.reload();
  }

    // $scope.myVar = 1;
    //
    // $scope.$watch('myVar', function() {
    //     alert('hey, myVar has changed!');
    // }, true);

    $scope.buttonClicked = function() {
        // $scope.myVar = 2; // This will trigger $watch expression to kick in
        alert($scope.myVar);
    };
});
