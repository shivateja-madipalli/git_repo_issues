let _ = require("lodash");
let request = require("request");

// let Constants = require("./constants");
// let Constants = new Constants();

let Constants = require("../static/constants.json");

// Created a class for more detailed Structure
function GitCall() {

}

// This API is for retrieving user_name/repo_name "shivateja-madipalli/git_repo_issues" from
// https://github.com/shivateja-madipalli/git_repo_issues

GitCall.prototype.fetchUserNameWithRepo = (publicRepoLink) => {
  // get git userName/publicRepoName from the publicRepoLink
  publicRepoLink = _.trim(publicRepoLink);
  console.log("publicRepoLink", publicRepoLink);
  let splitGitDetails = _.split(publicRepoLink, '/');
  return (
    splitGitDetails[splitGitDetails.length - 2] +
    Constants.SLASH +
    splitGitDetails[splitGitDetails.length - 1]
  );
}

// API for creating GIT URL with required URL Parameters

GitCall.prototype.createGitRequestToRetrieveIssues = (gitRepoEndpoint, sinceDate, order) => {
  // create git req structure endpoint
  // GET endpoint/repos/:owner/:repo/issues

  let endPoint = (
    gitRepoEndpoint +
    Constants.SLASH +
    Constants.ISSUES +
    Constants.QUESTIONMARK +
    Constants.PERPAGE100
  );
  if(sinceDate && order) {
    endPoint = (
      endPoint +
      Constants.AMPERSAND +
      Constants.SINCE +
      Constants.EQUALS +
      sinceDate +
      Constants.AMPERSAND +
      Constants.DIRECTION +
      Constants.EQUALS +
      order
    )
  }
  else if(sinceDate) {
    endPoint = (
      endPoint +
      Constants.AMPERSAND +
      Constants.SINCE +
      Constants.EQUALS +
      sinceDate
    )
  }
  else if(order) {
    endPoint = (
      endPoint +
      Constants.AMPERSAND +
      Constants.DIRECTION +
      Constants.EQUALS +
      order
    )
  }

  return endPoint;

};

// API for creating Git endpoint to retrieve Repo details

GitCall.prototype.createGitRequestToRetrieveRepo = (userNameWithRepo) => {
  // create git req structure endpoint
  // GET endpoint/repos/:owner/:repo/issues

  return  (
    Constants.GIT_API_ENDPOINT +
    Constants.SLASH +
    Constants.REPOS +
    Constants.SLASH +
    userNameWithRepo
  );

};

// GitCall.prototype.getOpenIssueCount = (gitRequest) => {
//   // call git repo
//   return new Promise(function(resolve, reject) {
//     request.get(gitRequest, Constants.OPTIONS, (error, response, body) => {
//       // console.log("error in getOpenIssueCount", error);
//       // console.log("response in getOpenIssueCount", response);
//       // console.log("body in getOpenIssueCount", body);
//       body = JSON.parse(body);
//       // console.log("BODY:", body);
//       if(body.has_issues) {
//         this.openIssuesCount = body.open_issues_count;
//       }
//       resolve(this.openIssuesCount);
//     }).on('error', (err) => {
//           console.log('ERROR', err);
//           reject(err);
//         });
//   });
//
// };

// API to do a get request for retrieving required data, depends on gitRequest Param

GitCall.prototype.doGitAPICall = function(gitRequest) {
  // call git repo
  return new Promise(function(resolve, reject) {
    request.get(gitRequest, Constants.OPTIONS, (error, response, body) => {
      // console.log("error in getOpenIssueCount", error);
      // console.log("response in getOpenIssueCount", response);
      // console.log("response. headers", response.headers);
      body = JSON.parse(body);
      let result = {
        body: body,
        response_headers: response.headers
      }
      resolve(result);
    }).on('error', (err) => {
          console.log('ERROR', err);
          reject(err);
        });
  });

};

module.exports = GitCall;
