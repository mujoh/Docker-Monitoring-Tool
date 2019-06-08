function ImagesController($scope, $http) {
  
  get_images();

  function get_images() {
    $http.get('/rest/v1/images').then(function(res) {
      $scope.images = res.data;
    });
  };
}