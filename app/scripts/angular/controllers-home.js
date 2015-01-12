angular.module('MyProject', ['MyProjectHomeCtrl','MyProjectHomeRouter']);

angular.module('MyProjectHomeCtrl', [])
  .controller('HomeCtrl', function($scope,$http,$location) {

      $http.get('/getLoginUser').success(function(data) {
        $scope.loginUser = data;
          });

      //User Management
      $http.get('/userlist').success(function(data) {
        $scope.users = data;
          });

      //Delete User
      $scope.deleteUser = function(user) {
        for(var i=0;i<$scope.users.length;i++){
          if($scope.users[i].email==user.email){
            $scope.users.splice(i,1);
            break;
          }
        }
        $http.post('/deleteUser',user).success(function(data) {
          if(data.status=="success"){
            alert("删除成功");
          }
        });
      };

      //New User
      $scope.newUser={
        email:"",
        username:"",
        password:"",
        password2:"",
        type:""
      };

      $scope.hasSameEmail = function() {
        $http.post('/hasSameEmail',$scope.newUser).success(function(data) {
          if(data.status=="error"){
            alert(data.message);
            $scope.newUser.email="";
          }
        });
      };

      $scope.addUser = function() {
        
        if($scope.newUser.email=="")return;
        if($scope.newUser.username=="")return;
        if($scope.newUser.password=="")return;
        if($scope.newUser.password!=$scope.newUser.password2){alert("两次密码输入不一致。");return;}
        if($scope.newUser.type==""){alert("请输入用户类型。");return;}
        var s = {
          email:$scope.newUser.email,
          username:$scope.newUser.username,
          password:$.md5($scope.newUser.password),
          type:$scope.newUser.type
        };
        $scope.users.push(s);
        $http.post('/addUser',s).success(function(data) {
          if(data.status=="success"){
            alert("添加成功");

            $location.path('/usermng');
          }
        });
      };

      //Edit User
      var editOldUser={
        email:"",
        username:"",
        type:""
      };

      $scope.editNewUser={
        email:"",
        username:"",
        type:""
      };

      $scope.getOldUser = function(user) {
        editOldUser.email=user.email;
        $scope.editNewUser=user;
      };

      $scope.editUser = function() {
        
        if($scope.editNewUser.email=="")return;
        if($scope.editNewUser.username=="")return;
        if($scope.editNewUser.type==""){alert("请输入用户类型。");return;}
        if(editOldUser.email=="")return;

        for(var i=0;i<$scope.users.length;i++){
          if($scope.users[i].email==editOldUser.email){
            $scope.users[i]=$scope.editNewUser;
            break;
          }
        }

        var s={
          olduser:editOldUser,
          newuser:$scope.editNewUser
        };

        $http.post('/updateUser',s).success(function(data) {
          if(data.status=="success"){
            alert("修改成功");
            $location.path('/usermng');
          }
        });
      };

      //Change Password
      $scope.changePsw={
        oldpsw:"",
        newpsw:"",
        newpsw2:""
      };

      $scope.changePassword = function() {
        
        if($scope.changePsw.oldpsw=="")return;
        if($scope.changePsw.newpsw=="")return;
        if($.md5($scope.changePsw.oldpsw)!=$scope.loginUser.password){alert("旧密码输入错误。");return;}
        if($scope.changePsw.newpsw!=$scope.changePsw.newpsw2){alert("两次密码输入不一致。");return;}

        var newpsw = $.md5($scope.changePsw.newpsw);
        $scope.loginUser.password = newpsw;

        var s={
          olduser:$scope.loginUser,
          newuser:$scope.loginUser
        };

        $http.post('/updateUser',s).success(function(data) {
          if(data.status=="success"){
            alert("修改成功");
          }
        });
      };

  });

angular.module('MyProjectHomeRouter', ['ngRoute']).config(['$routeProvider',function($routeProvider) {
  $routeProvider.
      when('/usermng', {templateUrl: 'partials/usermng.html',controller:function(){$('.side1').removeClass('active');$('.side2').addClass('active');$('.side3').removeClass('active');}}).
      when('/profile', {templateUrl: 'partials/profile.html',controller:function(){$('.side1').removeClass('active');$('.side2').removeClass('active');$('.side3').addClass('active');}}).
      when('/changepsw', {templateUrl: 'partials/changepsw.html',controller:function(){$('.side1').removeClass('active');$('.side2').removeClass('active');$('.side3').addClass('active');}}).
      when('/adduser', {templateUrl: 'partials/adduser.html',controller:function(){$('.side1').removeClass('active');$('.side2').addClass('active');$('.side3').removeClass('active');}}).
      when('/edituser', {templateUrl: 'partials/edituser.html',controller:function(){$('.side1').removeClass('active');$('.side2').addClass('active');$('.side3').removeClass('active');}}).
      otherwise({templateUrl: 'partials/welcome.html',controller:function(){$('.side1').addClass('active');$('.side2').removeClass('active');$('.side3').removeClass('active');}});
}]);

// angular.module('MyProject', [])
//   .controller('HomeCtrl', function($scope,$http) {

//     $http.get('/getLoginUser').success(function(data) {
//       $scope.loginUsername = data.username;
//         });
//   });



