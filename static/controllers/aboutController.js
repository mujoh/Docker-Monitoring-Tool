function AboutController($http, $scope) {
  $scope.Utils.set_config_var();
  $scope.loaded_version=false;
  $scope.loaded_info=false;

  get_info();
  get_docker_info();
  
  function get_info(){
    $http.get('/rest/v1/docker/version', $scope.config).then(function(res){
      $scope.docker_version_info = res.data;
      $scope.loaded_version=true;
    })
  }

  function get_docker_info() {
    $http.get('/rest/v1/docker/info', $scope.config).then(function (res) {
      $scope.docker_info = res.data;
      $scope.loaded_info=true;
    });
  };
}