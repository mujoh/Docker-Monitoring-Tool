function ActivityLogController($http, $scope, toastr) {
  console.log("activity controller");

  $scope.Utils.set_config_var();
  $scope.loaded = false;

  get_activities()

  function get_activities() {
    $http.get('/rest/v1/activity', $scope.config).then(function (res) {
      if (res.data.message) {
        toastr.error(res.data.message);
      } else {
        $scope.activities = res.data;
        console.log($scope.activities);
        $scope.loaded = true;
      }
    })
  }
}