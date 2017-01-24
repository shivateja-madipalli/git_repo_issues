let _ = require("lodash");
let request = require("request");

let Constants = require("./constants");

let constantsHandler = new Constants();

function GitCall(gitCreds) {
  this.gitCreds = gitCreds;
}

GitCall.prototype.fetchUserNameWithRepo = (publicRepoLink) => {
  // get git userName/publicRepoName from the publicRepoLink
  publicRepoLink = _.trim(publicRepoLink);
  console.log("publicRepoLink", publicRepoLink);
  let splitGitDetails = _.split(publicRepoLink, '/');
  return (
    splitGitDetails[splitGitDetails.length - 2] +
    constantsHandler.SLASH +
    splitGitDetails[splitGitDetails.length - 1]
  );
}

GitCall.prototype.createGitRequest = (userNameWithRepo, sinceDate, order) => {
  // create git req structure endpoint
  // GET endpoint/repos/:owner/:repo/issues

  return  (
    constants.GIT_API_ENDPOINT +
    constantsHandler.SLASH +
    constantsHandler.REPOS +
    constantsHandler.SLASH +
    userNameWithRepo +
    constantsHandler.ISSUES
  );

};

GitCall.prototype.createGitRequestToFetchIssueCount = (userNameWithRepo) => {
  // create git req structure endpoint
  // GET endpoint/repos/:owner/:repo/issues

  return  (
    constantsHandler.GIT_API_ENDPOINT +
    constantsHandler.SLASH +
    constantsHandler.REPOS +
    constantsHandler.SLASH +
    userNameWithRepo
  );

};

GitCall.prototype.getOpenIssueCount = (gitRequest) => {
  // call git repo
  return new Promise(function(resolve, reject) {
    request.get(gitRequest, (error, response, body) => {
      // console.log("error in getOpenIssueCount", error);
      // console.log("response in getOpenIssueCount", response);
      console.log("body in getOpenIssueCount", body);
      // body = JSON.parse(body);
      console.log("BODY:", body);

    }).on('error', (err) => {
          console.log('ERROR', err);
          reject(err);
        });
  });

};


// GitCall.prototype.fetchDetails = (gitRequest) => {
//   // call git repo
//
//   return new Promise(function(resolve, reject) {
//
//   });
//
// };

module.exports = GitCall;
