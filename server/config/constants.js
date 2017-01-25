
function Constants() {
}

Constants.prototype.SLASH = "/";
Constants.prototype.GIT_API_ENDPOINT = "https://api.github.com";
Constants.prototype.REPOS = "repos";
Constants.prototype.ISSUES = "issues";
Constants.prototype.ASC = "asc";
Constants.prototype.DESC = "desc";
Constants.prototype.SINCE = "since";
Constants.prototype.DIRECTION = "direction";
Constants.prototype.QUESTIONMARK = "?";
Constants.prototype.AMPERSAND = "&";
Constants.prototype.EQUALS = "=";
Constants.prototype.PERPAGE100 = "per_page=100";
Constants.prototype.HUNDRED = 100;
Constants.prototype.URLREGEX = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&/=]*)?/gi;

Constants.prototype.OPTIONS = {
  headers: {
    'User-Agent': 'git_repo_issues',
    'Authorization': 'token 1e5a772d8a1091895a71f1bb9907b465008cec82'
  }
};

module.exports = Constants;
