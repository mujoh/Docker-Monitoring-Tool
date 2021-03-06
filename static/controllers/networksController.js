function NetworksController($scope, $http, $ngConfirm, toastr) {
  
  $scope.Utils.set_config_var();
  get_networks();

  function get_networks() {
    $http.get('/rest/v1/networks', $scope.config).then(function(res) {
      $scope.networks = res.data;
    });
  };

  $scope.delete_network = function (network_id) {
    $ngConfirm({
      title: 'Delete Network?',
      content: 'Do you really want to delete network?',
      type: 'red',
      autoClose: 'close|6000',
      icon: 'fas fa-exclamation-triangle',
      scope: $scope,
      buttons: {
        yes: {
          text: "Yes",
          btnClass: 'btn-red',
          action: function (scope, button) {
            $http.delete('/rest/v1/networks/' + network_id + '/delete', $scope.config).then(function (res) {
              if (res.data.message) {
                toastr.error(res.data.message);
              } else {
                toastr.error("Network deleted!");
                get_networks();
              }
            }, function errorCallback(res) {
              toastr.error(res.data.message, "Error " + res.status + " while deleting network.");
            });
          }
        },
        close: function (scope, button) {
          //Close modal
        }
      }
    });
  };

  $scope.prune_networks = function () {
    $ngConfirm({
      title: 'Delete Unused Networks?',
      content: 'You are about to delete unused networks. Confirm?',
      type: 'blue',
      icon: 'fa fa-trash',
      scope: $scope,
      buttons: {
        yes: {
          text: "Yes",
          btnClass: 'btn-blue',
          action: function (scope, button) {
            $http.post('/rest/v1/networks/prune', {}, $scope.config).then(function (res) {
              if (res.data.message) {
                toastr.error(res.data.message);
              } else {
                toastr.success("You have successfully deleted unused networks");
                get_networks();
              }
            }, function errorCallback(res) {
              toastr.error(res.data.message, "Error " + res.status + " while deleting unused networks.");
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