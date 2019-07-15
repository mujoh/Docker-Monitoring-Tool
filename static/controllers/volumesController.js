function VolumesController($http, $scope) {
  $scope.Utils.set_config_var();
  $scope.loaded = false;

  get_volumes();

  function get_volumes() {
    $http.get("/rest/v1/volumes", $scope.config).then(function(res) {
      $scope.volumes = res.data.Volumes;
      if((Array.isArray(res.data.Warnings) && res.data.Warnings.length > 0) || res.data.Warnings != null) {
        $scope.warnings = res.data.Warnings;
      }
      $scope.loaded = true;
    })
  }
}