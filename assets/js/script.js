var app = angular.module('checkoutApp', []);
const APP_BASE_URL = 'http://localhost:8081/';
app.controller('checkoutCtrl', function($scope, $http, $templateCache, $window) {
  $templateCache.removeAll();
  $scope.items = [];
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
    $scope.items.push(itemId);
  }
  $scope.removeData = function (itemId) {
    if ($scope.items.indexOf(itemId) >= 0) {
      $scope.items.splice($scope.items.indexOf(itemId), 1);
    }
  }
  $scope.calculateData = function () {
    $http({
      method: 'POST',
      url: APP_BASE_URL + 'calculate',
      cache: $templateCache,
      data: {
        'customer': $scope.customer,
        'skus': $scope.items
      }
    })
    .then(function(response) {
      $scope.result = response;
    }, function(response) {
      $scope.result = response;
    });
  }
  $scope.refreshPage = function () {
    $window.location.reload();
  }
});
