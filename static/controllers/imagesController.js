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

  function generate_data(repo_tags, exposed_ports) {
    data='{"Containername": "' + $scope.container_name + '", "Image": "' + repo_tags + '", "HostConfig": {"PortBindings": { "' + exposed_ports + '": [{ "HostPort": "' + $scope.host_port + '" }] }}}'
  }

  $scope.create_container = function (image) {
    $http.get('/rest/v1/images/'+image+'/json', $scope.config).then(function (res) {
      image_data=res.data;
      $ngConfirm({
        title: 'Create Container?',
        content: '<input ng-model="container_name" type="text" placeholder="Container Name" class="form-control">'+
                 '<input ng-model="host_port" type="number" placeholder="Exposed port" class="form-control">',
        type: 'green',
        icon: 'fas fa-plus',
        scope: $scope,
        buttons: {
          yes: {
            text: "Yes",
            btnClass: 'btn-success',
            action: function (scope, button) {
              generate_data(image_data.RepoTags[0], Object.keys(image_data.ContainerConfig.ExposedPorts)[0])
              $http.post('/rest/v1/containers/create', data, $scope.config).then(function (res) {
                toastr.success("Container created!");
              }, function errorCallback(res) {
                toastr.error(res.data.message, "Error " + res.status + " while creating container.");
              })
            }
          },
          close: function (scope, button) {
            //Close modal
          }
        }
      });
    }, function errorCallback(res) {
      toastr.error(res.data.message, "Error " + res.status + " while getting image.");
    })
  }

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
              toastr.error(res.data.message, "Error " + res.status + " while deleting image.");
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
              toastr.error(res.data.message, "Error " + res.status + " while deleting unused images.");
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