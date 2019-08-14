function VolumesController($http, $scope, $ngConfirm, toastr) {
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
  };

  $scope.prune_volumes = function () {
    $ngConfirm({
      title: 'Delete Unused Volumes?',
      content: 'You are about to delete unused volumes. Confirm?',
      type: 'blue',
      icon: 'fa fa-trash',
      scope: $scope,
      buttons: {
        yes: {
          text: "Yes",
          btnClass: 'btn-blue',
          action: function (scope, button) {
            $http.post('/rest/v1/volumes/prune', {}, $scope.config).then(function (res) {
              if (res.data.message) {
                toastr.error(res.data.message);
              } else {
                toastr.success("You have successfully reclaimed " + $scope.Utils.convertMemorySize(res.data.SpaceReclaimed) + " of disk space");
                get_volumes();
              }
            }, function errorCallback(res) {
              toastr.error("Error " + res.status + " while deleting unused volumes.", res.statusText);
            });
          }
        },
        close: function (scope, button) {
          //Close modal
        }
      }
    });
  };
}