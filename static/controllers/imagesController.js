function ImagesController($scope, $http, $ngConfirm, toastr) {

  $scope.Utils.set_config_var();

  get_images();

  function get_images() {
    $http.get('/rest/v1/images', $scope.config).then(function (res) {
      $scope.images = res.data;
    }, function errorCallback(res) {
      toastr.error(res.data);
    });
  };

  $scope.delete_image = function (image_id) {
    $ngConfirm({
      title: 'Delete Image?',
      content: 'Do you really want to delete image?',
      type: 'red',
      autoClose: 'close|6000',
      icon: 'fas fa-exclamation-triangle',
      scope: $scope,
      buttons: {
        yes: {
          text: "Yes",
          btnClass: 'btn-red',
          action: function (scope, button) {
            $http.delete('/rest/v1/images/' + $scope.Utils.split_string(image_id) + '/delete', $scope.config).then(function (res) {
              if (res.data.message) {
                toastr.error(res.data.message);
              } else {
                toastr.error("Image deleted!");
                get_images();
              }
            }, function errorCallback(res) {
              toastr.error("Error " + res.status + " while deleting image.", res.statusText);
            });
          }
        },
        close: function (scope, button) {
          //Close modal
        }
      }
    });
  };

  $scope.prune_images = function () {
    $ngConfirm({
      title: 'Delete Unused Images?',
      content: 'Do you really want to delete unused images?',
      type: 'blue',
      icon: 'fas fa-trash',
      scope: $scope,
      buttons: {
        yes: {
          text: "Yes",
          btnClass: 'btn-blue',
          action: function (scope, button) {
            $http.post('/rest/v1/images/prune', {}, $scope.config).then(function (res) {
              if (res.data.message) {
                toastr.error(res.data.message);
              } else {
                toastr.success("You have successfully reclaimed " + $scope.Utils.convertMemorySize(res.data.SpaceReclaimed) + " of disk space");
                get_images();
              }
            }, function errorCallback(res) {
              toastr.error("Error " + res.status + " while deleting unused images.", res.statusText);
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