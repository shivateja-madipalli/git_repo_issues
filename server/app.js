let express = require("express");
let app = express();
let bodyParser = require("body-parser");
let _ = require("lodash");
let path = require('path');

let GitCall = require("./config/gitcall");

let Constants = require("./static/constants.json");
let Errors = require("./static/error.json");

let gitCallHandler = new GitCall();
const PORT = process.env.PORT || "2013";

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({extended: true})); // for parsing application/x-www-form-encoded

app.use(express.static(path.join(__dirname, 'pub')));


/*
The whole idea of the application is,
Step 1: -> Get the repo details which would have total open issues
PS: open issues also include pull requests
if(open issues === 0) {Abort}

Step 2: -> Retrieve last 24 hours Issues
if(it has multiple pages) => go get last page's issues and the total count would be
  total_24hours = 100 * (lastpage - 1) + count[lastpage];
else
  total_24hours = count[current page]

Step 3: -> Retrieve last 7 days Issues
if(it has multiple pages) => go get last page's issues and the total count would be
  total_7days = 100 * (lastpage - 1) + count[lastpage];
else
  total_7days = count[current page]

Step 4: -> Issues open before 7 days would be total_open - total_7days

Step 5: -> DONE :)
*/

// Exposed endpoint for Application

app.all('*',function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.get('/', function(req, res) {
  res.sendFile(path.resolve('./index.html'));
  });

let createResponse = (last24Hour, last7Day, before7Days, message, status) => {
  console.log("ISSUES of LAST 24 HOURS", last24Hour);
  console.log("ISSUES of LAST 7 DAYS", last7Day);
  console.log("ISSUES BEFORE 7 DAYS", before7Days);
  console.log("MESSAGE", message);
  console.log("STATUS", status);

  let res = {
    issues_in_last_24_hours: last24Hour,
    issues_in_last_7_days: last7Day,
    before_7_days: before7Days,
    message: message,
    status: status
  }
  return res;
}

let getTotalOpenIssues = (gitReqURL) => {
  return new Promise(function(resolve, reject) {
    gitCallHandler.doGitAPICall(gitReqURL).then((gitRepoContent) => {
      if(typeof gitRepoContent.body === 'undefined') {
        reject(Errors.WRONG_URL);
      }
      console.log("Gandalf knows everything and also know what are total open issues:", gitRepoContent.body.open_issues_count);
      resolve(gitRepoContent.body.open_issues_count);
    })
  }).catch((err) => {
    reject(err);
  });
}

let getLast24HourIssues = (gitReqURL) => {
  return new Promise(function(resolve, reject) {
    let date = getDateString(1);
    let endpointForlast24Hours =
    gitCallHandler.createGitRequestToRetrieveIssues(gitReqURL, date, Constants.DESC);
    console.log("Jim wants to know what is the endpointForlast24Hours? ", endpointForlast24Hours);

    let issuesinLast24Hours;
    gitCallHandler.doGitAPICall(endpointForlast24Hours).then((responseOf24HOURCall) => {
      // This is for current - 24 hours
      let headers = responseOf24HOURCall.response_headers;
      if(headers.link) {
        let lastPageDetails = getLastPage(Constants.last24hours, headers.link);
        console.log("Dexter is interested in total Number of issues in last 24 hours without Last Page", lastPageDetails.issues_other_than_lastpage_24_hours);
        issuesinLast24Hours = lastPageDetails.issues_other_than_lastpage_24_hours;
        return gitCallHandler.doGitAPICall(lastPage);
      }
      else {
        let body = responseOf24HOURCall.body;
        issuesinLast24Hours = body.length;
        resolve(issuesinLast24Hours);
      }
    }).then((responseOf24HourLastPage) => {
      let body = responseOf24HourLastPage.body;
      console.log("Stacey is asking for number of issues 24 HOURS CALL last page", body.length);
      issuesinLast24Hours += body.length;
      resolve(issuesinLast24Hours);

    }).catch((err)=> {
      reject(err);
    });
  });
}

let getLast7DaysIssues = (gitReqURL) => {
  return new Promise(function(resolve, reject) {
    let date = getDateString(7);
    let endpointForlast7Days =
    gitCallHandler.createGitRequestToRetrieveIssues(gitReqURL, date, Constants.DESC);
    console.log("Jim wants to know what is the endpointForlast7Days? ", endpointForlast7Days);
    let issuesinLast7Days;
    gitCallHandler.doGitAPICall(endpointForlast7Days).then((responseOf7DAYCall) => {
      // This is for current - 7 Days
      let headers = responseOf7DAYCall.response_headers;
      if(headers.link) {
        let lastPageDetails = getLastPage(Constants.last7days, headers.link);
        console.log("Dexter is interested in total Number of issues in last 7 Days without Last Page", lastPageDetails.issues_other_than_lastpage_7_days);
        issuesinLast7Days = lastPageDetails.issues_other_than_lastpage_7_days;
        return gitCallHandler.doGitAPICall(lastPage);
      }
      else {
        let body = responseOf7DAYCall.body;
        issuesinLast7Days = body.length;
        resolve(issuesinLast7Days);
      }
    }).then((responseOf7DaysLastPage) => {
      let body = responseOf7DaysLastPage.body;
      console.log("Stacey is asking for number of issues 7 DAYS CALL last page", body.length);
      issuesinLast7Days += body.length;
      resolve(issuesinLast7Days);

    }).catch((err)=> {
      reject(err);
    });
  });
}

let getIssues = (public_repo) => {
  let result = {};
  return new Promise(function(resolve, reject) {
    let userNamewithRepo = gitCallHandler.fetchUserNameWithRepo(public_repo);
    console.log("My precious: ", userNamewithRepo);
    let gitReqURL = gitCallHandler.createGitRequestToRetrieveRepo(userNamewithRepo);
    console.log("Harry is looking forward to the git Req URL: ", gitReqURL);
    getTotalOpenIssues(gitReqURL).then((totalOpenIssues) => {
      result[Constants.totalOpenIssues] = totalOpenIssues;
      if(totalOpenIssues === 0) {
        resolve(createResponse(0,0,0,Errors.NO_ISSUES, true));
      }
      return getLast24HourIssues(gitReqURL);
    }).then((totalCountof24Hour) => {
      //push into ur result;
      result[Constants.totalCountof24Hour] = totalCountof24Hour;
      return getLast7DaysIssues(gitReqURL);
    }).then((totalCountOf7Days) => {
      result[Constants.totalCountOf7Days] = totalCountOf7Days;
      let before7Days = result[Constants.totalOpenIssues] - result[Constants.totalCountOf7Days];
      console.log("RESULT", result);
      // resolve(
      //   createResponse(
      //     result[Constants.totalCountof24Hour],
      //     result[Constants.totalCountOf7Days],
      //     before7Days,
      //     Constants.SUCCESS_MESSAGE,
      //     true
      // ));
      resolve(
        createResponse(
          result[Constants.totalCountof24Hour],
          result[Constants.totalCountOf7Days],
          before7Days,
          Constants.SUCCESS_MESSAGE,
          true
      ));
    }).catch((err) => {
      console.log("REJECT CAUGHT in getIssues", err);
      resolve();
    })
  });
}

app.post("/getissues", (req, res) => {
  let public_repo = req.body.public_repo;
  console.log("public_repo", public_repo);
  let URLREGEX = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&/=]*)?/gi
  let regex = new RegExp(URLREGEX);
  if(public_repo.match(regex) === null) {
    let result = createResponse(0,0,0,Errors.WRONG_URL,false);
    res.status("200").json(result);
  }
  else {
    getIssues(public_repo).then((result) => {
      console.log("result", result);
      res.status("200").json(result);
    }).catch((err) => {
      console.log("ERROR: ", err);
      let res = createResponse(0,0,0,err,false);
      res.status("400").json(res);
    });
  }
});

let getLastPage = (type, nextLink) => {
  let splitLinks = _.split(nextLink, ';');
  let innerSplit = _.split(splitLinks[splitLinks.length - 2], ',');
  console.log(innerSplit[innerSplit.length - 1]);
  let lastURL = innerSplit[innerSplit.length - 1];
  lastURL = _.trim(lastURL);
  // console.log("lastURL before", lastURL);
  lastURL = lastURL.slice(1, lastURL.length-1);
  // console.log("lastURL", lastURL);
  let name = "page";

  let result = (/^[?#]/.test(lastURL) ? lastURL.slice(1) : lastURL)
  .split('&')
  .reduce((params, param) => {
    let [ key, value ] = param.split('=');
    params[key] = value ? decodeURIComponent(value.replace(/\+/g, ' ')) : '';
    return params;
  }, { });
  var response = {};
  if(type === "last24hours") {
    console.log("Meg is sure this condition should be true inside last24hours");
    response['issues_other_than_lastpage_24_hours'] = Constants.HUNDRED * (result.page - 1);
  }
  else if(type === "last7days") {
    console.log("Meg is sure this condition should be true inside last7days");
    response['issues_other_than_lastpage_7_days'] = Constants.HUNDRED * (result.page - 1);
  }
  response['last_page'] = lastURL;
  return response;
}

let getDateString = (range) => {
  let date = new Date();
  console.log("date", date.getDate());
  //creating range days previous date
  date.setDate(date.getDate() - range);
  date = JSON.stringify(date);
  date = JSON.parse(date);
  return date;
}

app.listen(PORT, () => {
  console.log("Node JS Listening on ", PORT);
});
