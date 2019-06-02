function SingleContainerController($http, $scope, $routeParams, $rootScope, toastr) {

  get_container_stats();
  get_container_info();
  get_container_processes();
  $scope.loaded_info = false;
  $scope.loaded_stats = false;

  function get_container_stats() {
    $http.get('/rest/v1/containers/' + $routeParams.id + '/stats', $scope.config).then(function (res) {
      $rootScope.container_stats = res.data;
      $rootScope.cpu_percent = $scope.Utils.calculate_cpu_percent($rootScope.container_stats);
      $scope.loaded_stats = true;
    }, function errorCallback(res) {
      toastr.error("Error " + res.status + " while getting container stats.", res.statusText);
    });
  };

  $scope.refresh_container = function () {
    $http.get('/rest/v1/containers/' + $routeParams.id + '/stats', $scope.config).then(function (res) {
      $rootScope.container_stats = res.data;
      $rootScope.cpu_percent = $scope.Utils.calculate_cpu_percent($rootScope.container_stats);
      toastr.success("Successfully Refreshed!");
    }, function errorCallback(res) {
      toastr.error("Error " + res.status + " while refreshing container.", res.statusText);
    });
  }

  function get_container_info() {
    $http.get('/rest/v1/containers/' + $routeParams.id + '/json', $scope.config).then(function (res) {
      $rootScope.container_info = res.data;
      $scope.loaded_info = true;
    }, function errorCallback(res) {
      toastr.error("Error " + res.status + " while getting container info.", res.statusText);
    });
  }

  function get_container_processes() {
    $http.get('/rest/v1/containers/' + $routeParams.id + '/top', $scope.config).then(function (res) {
      $rootScope.container_processes = res.data;
    }, function errorCallback(res) {
      toastr.error("Error " + res.status + " while getting container processes.", res.statusText);
    });
  }
}