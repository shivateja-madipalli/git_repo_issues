# git_repo_issues
### An Application to find the latest to all issues in a public repo

#### The Application is hosted in Heroku [Git_Repo_Issue](https://activegiverproj.herokuapp.com)


* Step 1: -> Get the repo details which would have total open issues, _PS: open issues also include pull requests_
  ```if(open issues === 0) {Abort}```
  
* Step 2: -> Retrieve last 24 hours Issues, if it has multiple pages, get the last page's issues and add to the total.

  ```javascript
if(multiple_pages) {
  total_24hours = 100 * (lastpage - 1) + count[lastpage];
}
else
  total_24hours = count[current page]
  ```
  
* Retrieve last 7 days Issues, if it has multiple pages, get the last page's issues and add to the total.

  ```javascript
if(multiple_pages) {
  total_24hours = 100 * (lastpage - 1) + count[lastpage];
}
else
  total_24hours = count[current page]
  ```
* Issues open before 7 days would be total_open - total_7days

* May the force be with you \m/


_Shivateja(Shiv) Madipalli_
_https://shivatejam.com_
