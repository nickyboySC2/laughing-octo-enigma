var express = require("express");

var mongo = require('mongodb').MongoClient;

var dbpath = 'mongodb://nickyboy:123123@ds119750.mlab.com:19750/hello';

function addUrl(myUrl,callback){
	mongo.connect(dbpath,(err,db)=>{
		if (err){
			db.close();
			return console.error(err);
		}
		var urls = db.collection('urls');
		urls.count((err,short)=>{
			urls.insertOne({'original':myUrl,'short':short.toString()},(err,result)=>{
				db.close();
				callback(short);
			});		
		});
	});
}

function getUrl(myUrl,callback){
	mongo.connect(dbpath,(err,db)=>{
		if (err){
			db.close();
			return console.log(err);
		}
		var urls = db.collection('urls');
		urls.findOne({'original':myUrl},(err,result)=>{
			if(!result){
				db.close();
				addUrl(myUrl,(res)=>{
					callback(res);
				});
			}else{
				db.close();
				callback(result['short']);
			}
		});
	});
}
function getRedirect(myShortUrl,callback){
	mongo.connect(dbpath,(err,db)=>{
		if (err){
			db.close();
			return console.error(err);
		}
		var urls = db.collection('urls');
		urls.findOne({'short':myShortUrl},(err,result)=>{
			db.close();
			if(!result){
				callback(undefined);
			}else{
				callback(result.original);
			}
		});
	});
}

var app = express();

var validUrl = require('valid-url');

app.get('/new/*', function (req, res) {
	var url=req.url.substring(req.url.indexOf("new")+4);
	if(!validUrl.isUri(url)){
		res.end("Error: invalid url");
	}else{
		getUrl(url,(shortUrl)=>{
			var responseObj = {"Original url":url,"Short url":((req.hostname)+'/'+(shortUrl))};
			res.writeHead(200,{"content-type": "application/JSON"});
			res.end(JSON.stringify(responseObj));
		});
	}
});

app.get('/*',function(req,res){
	var url=req.url.substring(1);
	getRedirect(url,(redirect)=>{
		if(!redirect){
			res.writeHead(400,{"content-type": "text/HTML"});
			res.end("Error: url not found in database");
		}else{
			res.writeHead(200,{"content-type": "text/HTML"});
			res.end("<script>window.location.replace("+"\""+redirect+"\""+")</script>");
		}
	});
});

app.listen(process.env.PORT||8888, function () {
	
});

/*mongo.connect(dbpath,(err,db)=>{
	if (err){
		db.close();
		return console.log(err);
	}
	var urls = db.collection('urls');
	urls.find().toArray((err,docs)=>{
		console.log(docs);
		db.close();
	});
});*/