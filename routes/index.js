var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
	//res.render('index', { title: 'Express' });
	res.sendfile('app/index.html');
});

router.get('/login', function(req, res) {
	//res.render('index', { title: 'Express' });
	res.sendfile('app/login.html');
});

router.get('/home', function(req, res) {
	//res.render('index', { title: 'Express' });
	res.sendfile('app/home.html');
});

router.post('/login', function(req, res) {
	//res.render('index', { title: 'Express' });
	var db = req.db;
	var collection = db.get('usercollection');
	console.log(req.body);
	collection.find({email:req.body['email'],password:req.body['password']},{},function(e,docs){
		if(e){
			res.send("err");
		}
		else{
			res.send(docs);
		}
    });
});

router.get('/userlist', function(req, res) {
	var db = req.db;
	var collection = db.get('usercollection');
	collection.find({},{},function(e,docs){
		res.send(docs);
    });
});

module.exports = router;
