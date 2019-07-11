function VolumesController($http, $scope) {
  $scope.Utils.set_config_var();
  $scope.loaded = false;

  get_volumes();

  function get_volumes() {
    $http.get("/rest/v1/volumes", $scope.config).then(function(res) {
      $scope.volumes = res.data.Volumes;
      if(res.data.Warnings.length > 0) {
        $scope.warnings = res.data.Warnings;
      }
      $scope.loaded = true;
    })
  }
}