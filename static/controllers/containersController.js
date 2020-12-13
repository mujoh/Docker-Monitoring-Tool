function ContainersController($http, $scope, $routeParams, $rootScope, $ngConfirm, toastr) {

  $scope.Utils.set_config_var();
  $scope.loaded = false;
  $scope.stop_class = "fas fa-stop";
  $scope.restart_class = "fas fa-sync-alt";

  get_containers();

  function get_containers() {
    $http.get('/rest/v1/containers', $scope.config).then(function (res) {
      $scope.containers = res.data;
      $scope.loaded = true;
    }, function errorCallback(res) {
      toastr.error(res.data);
    })
  }

  $scope.start_container = function (container_id) {
    $http.post('/rest/v1/containers/' + container_id + '/start', {}, $scope.config).then(function (res) {
      if (res.data.message) {
        toastr.error(res.data.message);
      } else {
        toastr.success("Container started!");
        get_containers();
      }
    }, function errorCallback(res) {
      toastr.error(res.data.message, "Error " + res.status + " while starting container.");
    });
  };

  $scope.restart_container = function (container_id) {
    $ngConfirm({
      title: 'Restart Container?',
      content: 'You are about to restart container. Confirm?',
      type: 'green',
      icon: 'fas fa-sync-alt',
      scope: $scope,
      buttons: {
        yes: {
          text: "Yes",
          btnClass: 'btn-green',
          action: function (scope, button) {
            $scope.restart_class = "fas fa-sync-alt fa-spin";
            $http.post('/rest/v1/containers/' + container_id + '/restart', {}, $scope.config).then(function (res) {
              if (res.data.message) {
                toastr.error(res.data.message);
              } else {
                toastr.success("Container restarted!");
                get_containers();
                $scope.restart_class = "fas fa-sync-alt";
              }
            }, function errorCallback(res) {
              toastr.error(res.data.message, "Error " + res.status + " while restarting container.");
            });
          }
        },
        close: function (scope, button) {
          //Close modal
        }
      }
    });
  };

  $scope.stop_container = function (container_id) {
    $ngConfirm({
      title: 'Stop Container?',
      content: 'You are about to stop container. Confirm?',
      type: 'orange',
      icon: 'fa fa-stop',
      scope: $scope,
      buttons: {
        yes: {
          text: "Yes",
          btnClass: 'btn-orange',
          action: function (scope, button) {
            $scope.stop_class = "fas fa-stop fa-spin";
            $http.post('/rest/v1/containers/' + container_id + '/stop', {}, $scope.config).then(function (res) {
              if (res.data.message) {
                toastr.error(res.data.message);
              } else {
                toastr.success("Container stopped!");
                get_containers();
                $scope.stop_class = "fas fa-stop";
              }
            }, function errorCallback(res) {
              toastr.error(res.data.message, "Error " + res.status + " while stopping container.");
            });
          }
        },
        close: function (scope, button) {
          //Close modal
        }
      }
    });
  };

  $scope.delete_container = function (container_id) {
    $ngConfirm({
      title: 'Delete Container?',
      content: 'You are about to delete container. Confirm?',
      type: 'red',
      icon: 'fa fa-trash',
      autoClose: 'close|6000',
      scope: $scope,
      buttons: {
        yes: {
          text: "Yes",
          btnClass: 'btn-red',
          action: function (scope, button) {
            $http.delete('/rest/v1/containers/' + container_id + '/delete', $scope.config).then(function (res) {
              if (res.data.message) {
                toastr.error(res.data.message);
              } else {
                toastr.success("Container deleted!");
                get_containers();
              }
            }, function errorCallback(res) {
              toastr.error(res.data.message, "Error " + res.status + " while deleting container.");
            });
          }
        },
        close: function (scope, button) {
          //Close modal
        }
      }
    });
  };

  $scope.prune_containers = function () {
    $ngConfirm({
      title: 'Delete Stopped Containers?',
      content: 'You are about to delete stopped containers. Confirm?',
      type: 'blue',
      icon: 'fa fa-trash',
      scope: $scope,
      buttons: {
        yes: {
          text: "Yes",
          btnClass: 'btn-blue',
          action: function (scope, button) {
            $http.post('/rest/v1/containers/prune', {}, $scope.config).then(function (res) {
              if (res.data.message) {
                toastr.error(res.data.message);
              } else {
                toastr.success("You have successfully reclaimed " + $scope.Utils.convertMemorySize(res.data.SpaceReclaimed) + " of disk space");
                get_containers();
              }
            }, function errorCallback(res) {
              toastr.error(res.data.message, "Error " + res.status + " while deleting stopped container.");
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