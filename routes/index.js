var express = require('express');
var router = express.Router();

//主页
router.get('/', function(req, res) {
	//res.render('index', { title: 'Express' });
	//res.sendfile('app/index.html');
	return res.redirect('/home');
});

//登陆页
router.get('/login', function(req, res) {
	if (req.session.user) {
        return res.redirect('/home');
    }
	res.sendfile('app/login.html');
});

//登录后主页
router.get('/home', function(req, res) {
	if (!req.session.user) {
        return res.redirect('/login');
    }
	res.sendfile('app/home.html');
});

function authentication(req, res) {
    if (!req.session.user) {
        return res.redirect('/login');
    }
}

//获取登录用户
router.get('/getLoginUser', function(req, res) {
	if (req.session.user)res.send(req.session.user);
	else res.send(null);
});

//登出操作
router.get('/logout', function(req, res) {
	req.session.user = null;
	res.redirect('/login');
});

//登录操作
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
			req.session.user = docs[0];
			res.send(docs);
		}
    });
});

//判断同邮箱
router.post('/hasSameEmail', function(req, res) {
	if (!req.session.user) {
        return res.redirect('/login');
    }
	var db = req.db;
	var collection = db.get('usercollection');
	//判断同名
	collection.find({email:req.body['email']},{},function(e,docs){
		if(docs.length>0){
			res.send({status:"error",message:"该邮箱已被注册。"});
		}
		else{
			res.send({status:"success"});
		}
    });
});

//创建新用户操作
router.post('/addUser', function(req, res) {
	if (!req.session.user) {
        return res.redirect('/login');
    }
	var db = req.db;
	var collection = db.get('usercollection');
	
	collection.insert(req.body,function(err,doc){
		if(err){
			res.send({status:"error",message:"服务器忙，请稍后再试。"});
		}
		else{
			res.send({status:"success"});	
		}
	});
});

//更新用户操作
router.post('/updateUser', function(req, res) {
	if (!req.session.user) {
        return res.redirect('/login');
    }
	var db = req.db;
	var collection = db.get('usercollection');
	collection.update({email:req.body.olduser.email},req.body.newuser,{safe:true},function(e,docs){
		if(docs>0){
			res.send({status:"success"});
		}
		else{
			console.log(docs);
			res.send({status:"error",message:"更新失败。"});
		}
    });
});

//删除用户操作
router.post('/deleteUser', function(req, res) {
	if (!req.session.user) {
        return res.redirect('/login');
    }
	var db = req.db;
	var collection = db.get('usercollection');
	collection.remove({email:req.body['email']},{safe:true},function(e,docs){
		if(docs>0){
			res.send({status:"success"});
		}
		else{
			res.send({status:"error",message:"更新失败。"});
		}
    });
});

//获取用户列表
router.get('/userlist', function(req, res) {
	if (!req.session.user) {
        return res.redirect('/login');
    }
	var db = req.db;
	var collection = db.get('usercollection');
	collection.find({},{},function(e,docs){
		res.send(docs);
    });
});

module.exports = router;
