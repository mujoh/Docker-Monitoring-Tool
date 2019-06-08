function ContainersController($http, $scope, $routeParams, $rootScope, $ngConfirm, toastr) {

  $scope.loaded = false;

  get_containers();

  function get_containers() {
    $http.get('/rest/v1/containers').then(function (res) {
      $scope.containers = res.data;
      $scope.loaded = true;
    })
  }

  $scope.start_container = function (container_id) {
    $http.post('/rest/v1/containers/' + container_id + '/start', {}, $scope.config).then(function (res) {
      toastr.success("Container started!");
      get_containers();
    }, function errorCallback(res) {
      toastr.error("Error " + res.status + " while starting container.", res.statusText);
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
            $http.post('/rest/v1/containers/' + container_id + '/restart', {}, $scope.config).then(function (res) {
              toastr.success("Container restarted!");
              get_containers();
            }, function errorCallback(res) {
              toastr.error("Error " + res.status + " while restarting container.", res.statusText);
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
            $http.post('/rest/v1/containers/' + container_id + '/stop', {}, $scope.config).then(function (res) {
              toastr.success("Container stopped!");
              get_containers();
            }, function errorCallback(res) {
              toastr.error("Error " + res.status + " while stopping container.", res.statusText);
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
              toastr.success("Container deleted!");
              get_containers();
            }, function errorCallback(res) {
              toastr.error("Error " + res.status + " while deleting container.", res.statusText);
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