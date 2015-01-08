angular.module('myproject', [])
	.controller('LoginCtrl', function($scope,$http) {
        $scope.login = function() {
   			$http.post('/login', $scope.user).success(function(data) {
        		if(data==null||data.length==0){
        			alert("用户名或密码错误。");
        		}
        		else{
        			window.location.href="/home";
        		}
        		
      		}).error(function(){
      			alert("用户名或密码错误。");
      		})

        };
	});