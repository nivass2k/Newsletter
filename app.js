const express=require("express");
const bodyParser=require("body-parser");
const https=require("https");
const request=require("request");

const app=express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

app.get("/",function(req,res){
    res.sendFile(__dirname+"/signup.html");
});

app.post("/",function(req,res){
    var firstname=req.body.firstname;
    var lastname=req.body.lastname;
    var mail=req.body.inputEmail;
    var data ={
        members:[
            {
                email_address:mail,
                status:"subscribed",
                merge_fields:{
                    FNAME:firstname,
                    LNAME:lastname,
                }
            }
        ]
    };
    const jsonData=JSON.stringify(data);
    const url="https://us1.api.mailchimp.com/3.0/lists/5d35073faf";
    const options={
        method:"POST",
        auth:"lucky:e0d9767ab5ddb47afb61e608c5d88548-us1"
    }
    const request=https.request(url,options,function(response){
        response.on("data",function(data){
            console.log(JSON.parse(data));
        })
    })
    request.write(jsonData);
    request.end();
});

app.listen(process.env.PORT || 3000);

// 5d35073faf
// e0d9767ab5ddb47afb61e608c5d88548-us1
