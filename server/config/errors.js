
function Errors() {
}

Errors.prototype.ISSUECOUNTZERO = "issue count is zero";
Errors.prototype.NO24HOURISSUECOUNT = "No issues in last 24 Hours";
Errors.prototype.NO7DAYISSUECOUNT = "No issues in last 7 Days";
Errors.prototype.NOISSUEBEFORECOUNT = "No issues before 7 Days";
Errors.prototype.WRONGDATA = "Wrong URL";


module.exports = Errors;
