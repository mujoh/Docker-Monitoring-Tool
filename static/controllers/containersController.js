function ContainersController($http, $scope) {
  get_containers();

  function get_containers() {
    $http.get('/rest/v1/containers').then(function(res) {
      $scope.containers = res.data;
    })
  }
}