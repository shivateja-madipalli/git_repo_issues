var application = angular.module("git_repo_issues", ['ngRoute']);

application.controller("textinputCntrl", function($scope, $http) {
  $scope.openIssues = {};

  $scope.getIssuesCount = function()  {
    // do a rest call to node backend
    var reqData = createReqBody($scope.publicRepo);
    console.log("ReqData", reqData);
    $http.post("http://localhost:2012/getissues", reqData)
    .then((response) => {
      console.log("RESPONSE", response);
      console.log("response.data", response.data);
      if(response.data.status === false) {
        $scope.colorcode = "color-red";
      }
      else {
        $scope.colorcode = "color-yellow";
      }
      $scope.openIssues = response.data;
      $scope.publicRepo = null;
    }).catch((error) => {
      console.log("ERROR", error);
    });
  }

  var createReqBody = function(publicRepo) {
    var request = {
      public_repo : publicRepo
    }
    return request;
  }

});
