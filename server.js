var express = require("express");

var app = express();

app.use(express.static('client'));

app.get('/*', function (req, res) {
	var responseObj = {"ipaddress":null,"language":null,"software":null};
	console.log(req.headers);
	var ip = req.headers['x-forwarded-for'] || 
    	req.connection.remoteAddress || 
    	req.socket.remoteAddress ||
    	req.connection.socket.remoteAddress||
    "N/A";
	var language = req.get('accept-language');
	var software = req.get('user-agent');
	responseObj["ipaddress"]=ip;
	//epic hax
	responseObj["language"]=language.split(',')[0];
	responseObj["software"]=software.split('(')[1].split(')')[0];
	res.send(JSON.stringify(responseObj));
});

app.listen(process.env.PORT||8888, function () {
	console.log('Example app listening on port %s!',process.env.PORT);
});

