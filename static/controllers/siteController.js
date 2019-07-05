function SiteController($http, $scope, toastr, $ngConfirm, $location) {

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

  if(localStorage.getItem('sidebarState') == 'toggled') {
    $scope.shrinked = localStorage.getItem('sidebarState');
    $scope.toggled = "toggled";
    $scope.shrinked_sidebar = true;
  }

  $scope.shrink = function() {
    $scope.shrinked = "shrinked";
    $scope.toggled = "toggled";
    $scope.shrinked_sidebar = true;
    localStorage.setItem('sidebarState', "toggled")
  }

  $scope.expand = function() {
    $scope.shrinked = "";
    $scope.toggled = "";
    $scope.shrinked_sidebar = false;
    localStorage.removeItem('sidebarState');
  }

  $scope.check_login = function () {
    if (localStorage.getItem('user')) {
      return true;
    }
    return false;
  }

  $scope.getClass = function (path) {
    return ($location.path().substr(0, path.length) === path) ? 'active' : '';
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

  $scope.logout = function () {
    $ngConfirm({
      title: "Log Out?",
      content: "Are you sure you want to log out?",
      type: 'blue',
      typeAnimated: true,
      scope: $scope,
      buttons: {
        yes: {
          text: "Yes",
          btnClass: 'btn-blue',
          action: function (scope, button) {
            toastr.info("Logged Out!");
            localStorage.clear();
          }
        },
        no: function (scope, button) {
          //Closes Modal
        }
      }
    })
  }
}