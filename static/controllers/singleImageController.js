function SingleImageController($scope, $http, $routeParams, toastr) {

  get_image_info();
  $scope.loaded = false;

  function get_image_info() {
    $http.get('/rest/v1/images/' + $scope.Utils.split_string($routeParams.id) + '/json', $scope.config).then(function (res) {
      if (res.data.message) {
        toastr.error(res.data.message);
      } else {
        $scope.image_info = res.data;
        $scope.loaded = true;
      }
    }, function errorCallback(res) {
      toastr.error(res.data.message, "Error " + res.status + " while getting image info.");
    });
  }

}