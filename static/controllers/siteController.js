function SiteController($http, $scope, toastr) {

  $scope.login = true;
  $scope.registration = false;

  $scope.registration_toggle = function () {
    $scope.registration = true;
    $scope.login = false;
  }

  $scope.login_toggle = function () {
    $scope.login = true;
    $scope.registration = false;
  }

  $scope.register = function (user) {
    $http.post('/rest/v1/register', user).then(function (res) {
      toastr.success(res.data.message);
    }), function (response) {
      console.log(error);
    }
  }

  $scope.check_login = function () {
    if (localStorage.getItem('user')) {
      return true;
    }
    return false;
  }

  $scope.login = function (credentials) {
    $http.post('/login', credentials).then(function (res) {
      if (res.data.success == true) {
        localStorage.setItem('user', res.data.token)
        $scope.Utils.set_config_var();
        toastr.success('You are successfully logged in!', res.data.message);
      }
      else if (res.data.success == false) {
        toastr.error(res.data.message);
      }
    }), function (response) {
      console.log(error);
    }
  }
}