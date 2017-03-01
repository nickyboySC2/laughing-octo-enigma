var express = require("express");

var app = express();

app.use(express.static('client'));

var validUrl = require('valid-url');

var urls = 0;
var urlList = [];

app.get('/new/*', function (req, res) {
	console.log(req.url);
	var url=req.url.substring(req.url.indexOf("new")+4);
	console.log(url);
	if(!validUrl.isUri(url)){
		res.send("Error: invalid url");
	}
	urlList[+urls]=url;
	var responseObj = {"Original url":url,"Short url":((process.env.HOSTNAME)+'/'+(urls))};
	urls++;
	res.send(responseObj);
});

app.get('/*',function(req,res){
	var url=req.url.substring(1);
	if(!urlList[url]){
		res.send("Error: url not found in 'database'");
	}
	res.send("<script>window.location.replace("+"\""+urlList[url]+"\""+")</script>");
});

app.listen(process.env.PORT||8888, function () {
	console.log('Example app listening on port %s!',process.env.PORT);
});

