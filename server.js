var express = require("express");

var app = express();

var validUrl = require('valid-url');

var urls = 0;
var urlList = [];

app.get('/new/*', function (req, res) {
	var url=req.url.substring(req.url.indexOf("new")+4);
	console.log(url);
	if(!validUrl.isUri(url)){
		res.end("Error: invalid url");
	}else{
		urlList[+urls]=url;
		var responseObj = {"Original url":url,"Short url":((req.hostname)+'/'+(urls))};
		urls++;
		res.writeHead(200,{"content-type": "application/JSON"})
		res.end(JSON.stringify(responseObj));
	}
});

app.get('/*',function(req,res){
	var url=req.url.substring(1);
	if(!urlList[url]){
		res.writeHead(400,{"content-type": "text/HTML"});
		res.end("Error: url not found in 'database'");
	}else{
		res.writeHead(200,{"content-type": "text/HTML"});
		res.end("<script>window.location.replace("+"\""+urlList[url]+"\""+")</script>");
	}
});

app.listen(process.env.PORT||8888, function () {
	console.log('Listening on port %s!',process.env.PORT);
});

