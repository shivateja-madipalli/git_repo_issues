let express = require("express");
let app = express();
let bodyParser = require("body-parser");

let gitCall = require("./config/gitcall");

let gitCallHandler = new gitCall("abc");

const PORT = "2012";

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({extended: true})); // for parsing application/x-www-form-encoded

app.post("/getissues", (req, res) => {
  let public_repo = req.body.public_repo;
  console.log("public_repo", public_repo);
  var result = {
    data: "data"
  }
  // res.status("200").json(result);
  let userNamewithRepo = gitCallHandler.fetchUserNameWithRepo(public_repo);
  console.log("userNamewithRepo:", userNamewithRepo);

  let gitReqURL = gitCallHandler.createGitRequestToFetchIssueCount(userNamewithRepo);
  console.log("gitReqURL:", gitReqURL);

  gitCallHandler.getOpenIssueCount(gitReqURL).then((totalCount) => {
    console.log("TOTAL OPEN ISSUE COUNT", totalCount);
    res.status("200").json(result);
  }).catch((err) => {
    res.status('400');
  });
});

app.listen(PORT, () => {
  console.log("Node JS Listening on ", PORT);
});
