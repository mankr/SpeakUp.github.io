var app = angular.module('speakUp', ['ngRoute', 'ngCookies']);

	app.config(function($routeProvider, $locationProvider) {
	  	$routeProvider
	   .when('/', {
		    templateUrl: 'home.html',
		    controller: 'HomeController',
		})

	   .when('/signup', {
		    templateUrl: 'signup.html',
		    controller: 'SignupController',
		});
  });

	app.run(function($rootScope, $cookies) {
		if($cookies.get('token') && $cookies.get('currentUser')) {
			$rootScope.token = $cookies.get('token');
			$rootScope.currentUser = $cookies.get('currentUser');
		}
	});

		app.controller('HomeController', function($rootScope, $scope, $http, $cookies){

			$scope.submitNewTalk = function() {
				$http.post('/meows',
					{newMeow: $scope.newMeow, description: $scope.description},
					{headers: {
						'authorization': $rootScope.token
					}}).then(function(){
					getMeows();
					$scope.newMeow = '';
					$scope.description = '';
				});
			};


			$scope.removeMeow = function(meow) {
				$http.put('/meows/remove',
					{meow: meow},
					{headers: {
						'authorization': $rootScope.token
					}}).then(function(){
					getMeows();

				});
			};

			$scope.signin = function() {
				$http.put('/users/signin', {username: $scope.username, password: $scope.password}).then(function(res){
					
					$cookies.put('token', res.data.token);
					$cookies.put('currentUser', $scope.username);
					$rootScope.token = res.data.token;
					$rootScope.currentUser = $scope.username;

				}, function(err) {
					alert('bad login credentials');
				});
			}

			$scope.logout = function() {
					$cookies.remove('token');
					$cookies.remove('currentUser');
					$rootScope.token = null;
					$rootScope.currentUser = null;
			};

			function getMeows() {
				$http.get('/meows').then(function(response) {

				$scope.meows = response.data;

			 });

			}

			getMeows();
		});

		app.controller('SignupController', function($scope, $http){

				$scope.submitSignup = function() {
					var newUser = {
						username: $scope.username,
						password: $scope.password
					};

					$http.post('/users', newUser).then(function(){
					alert('success');
					});
				}
		});
