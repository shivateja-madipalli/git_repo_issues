var application = angular.module("git_repo_issues", ['ngRoute']);

application.controller("textinputCntrl", function($scope, $http) {
  $scope.openIssues = {};

  // $scope.publicRepo = "";

  $scope.getIssuesCount = function()  {
    // do a rest call to node backend
    var reqData = createReqBody($scope.publicRepo);
    console.log("ReqData", reqData);
    $http.post("http://localhost:2012/getissues", reqData)
    .then((response) => {
      console.log("RESPONSE", response);
      console.log("response.data", response.data);
      $scope.openIssues = response.data;
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
