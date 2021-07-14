const { urlencoded } = require("express");
const express = require("express");
var request = require('superagent');
var app = express();
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.get("/",function(req,res){
    res.sendFile(__dirname+"/signup.html");
});

app.listen(process.env.PORT || 3000);

var mailchimpInstance   = 'us1',
    listUniqueId        = '5d35073faf',
    mailchimpApiKey     = 'e0d9767ab5ddb47afb61e608c5d88548-us1';

app.post('/', function (req, res) {
  console.log(req.body.firstname)
    request
        .post('https://' + mailchimpInstance + '.api.mailchimp.com/3.0/lists/' + listUniqueId + '/members/')
        .set('Content-Type', 'application/json;charset=utf-8')
        .set('Authorization', 'Basic ' + new Buffer.from('any:' + mailchimpApiKey ).toString('base64'))
        .send({
          'email_address': req.body.inputEmail,
          'status': 'subscribed',
          'merge_fields': {
            'FNAME': req.body.firstname,
            'LNAME': req.body.lastname
          }
        })
            .end(function(err, response) {
              if (response.status < 300 || (response.status === 400 && response.body.title === "Member Exists")) {
                res.sendFile(__dirname+"/success.html");
              } else {
                res.send(__dirname+"/failure.html");
              }
          });
});