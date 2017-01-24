
function Constants() {

}

Constants.prototype.SLASH = "/";
Constants.prototype.GIT_API_ENDPOINT = "https://api.github.com";
Constants.prototype.REPOS = "repos";
Constants.prototype.ISSUES = "issues";

Constants.prototype.OPTIONS = {
  headers: {
    'User-Agent': '',
    'Authorization': ''
  }
};

module.exports = Constants;
