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
              toastr.error("Error " + res.status + " while deleting network.", res.statusText);
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