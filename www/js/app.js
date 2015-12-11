angular.module('starter_todo', ['ionic','firebase'])


    .controller('show_todo', function (userDetails,$scope) {


        $scope.data=userDetails.showTodo();


        $scope.userName='Public';

        $scope.$on('mains', function (e, data) {

            //console.log(data.syncData);
            //console.log(data.user);

            $scope.data = data.syncData;

            if(data.user!=null)
            {
                $scope.userName=data.user;
            }
            else{
                $scope.userName='Public';
            }

        });
        
        $scope.delete_task= function (task) {

            console.log(task);
            userDetails.delete_todo(task);
        }

    })

    .controller('AppCtrl', function($scope,$rootScope, $ionicActionSheet,userDetails,$firebaseAuth) {

        var flag=true;

        var flag_child=true;

        var log='SignIn';

        $rootScope.$on("$firebaseAuth:logout", function(event) {
            userDetails.logout(null);

            window.cookies.clear(function() {
                console.log("Cookies cleared!");
            });
        });

        $scope.showActionsheet = function () {

            $ionicActionSheet.show({
                titleText: 'Select your Desired Option',
                buttons: [
                    {text: '<i class="icon ion-social-facebook"></i> '+log},
                ],
                cancelText: 'Cancel',
                cancel: function () {
                    //console.log('CANCELLED');
                },
                buttonClicked: function (index) {

                    var todo=null;
                    if (index == 0) {

                        console.log("1:"+flag_child+"/"+log);

                        if(flag_child == true) {


                            $rootScope.$watch(function(scope) {

                                    var obj={syncData:userDetails.syncData(),user:userDetails.userName()};

                                    $scope.$emit('mains',obj);


                                    if(userDetails.returnFlagCheck()==false)
                                    {
                                        console.log("2:" + flag_child + "/" + log);

                                                log = 'SignIn';

                                                flag_child = true;
                                    }
                                    else
                                    {
                                        if(flag==true) {
                                            console.log("3:" + flag_child + "/" + log);

                                            log = 'SignOut';

                                            flag_child = false;
                                        }
                                    }
                                },
                                function() {

                                    todo=userDetails.showLoginDialog();

                                    console.log("4:" + flag_child + "/" + log);

                                        log = 'SignOut';

                                        flag_child = false;

                                    flag=true;
                                })
                        }
                        else
                        {
                            flag=false;

                                log = 'SignIn';

                                flag_child = true;

                                console.log('5:'+flag_child+"/"+log);

                            userDetails.logout();

                            var obj={syncData:userDetails.syncData(),user:userDetails.userName()};

                            $scope.$emit('mains',obj);
                        }
                    }

                    console.log('ok');

                    return true;
                }
            });
        }

    })

                    //For showing tabs in bottom
    //.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
    //    $ionicConfigProvider.tabs.position('bottom');
    //})

    .controller('add_tasks', function (userDetails) {

        this.change_mode= function () {
            if(this.mode==false)
            {
                this.mode_task='Public'
            }
            else
            {
                this.mode_task='Private'
            }
        }

        this.save_task=function(){
            console.log(this.txt_task);
            console.log(this.mode);

            userDetails.store_todo(this.txt_task,this.mode);

            this.txt_task="";
            this.mode=false;
            this.mode_task='Public'

        }
        
        this.log_fb= function () {
            if(userDetails.returnFlagCheck()==true)
            {
                return true;
            }
            else
            {
                return false;
            }
        }
    })


.run(function($ionicPlatform, $ionicPopup) {
  $ionicPlatform.ready(function() {

      setTimeout(function() {
          navigator.splashscreen.hide();
      }, 6000);

      // Check for network connection
      if (window.Connection) {
          if (navigator.connection.type == Connection.NONE) {
              $ionicPopup.confirm({
                  title: 'Network Problem',
                  content: 'Sorry, Please Check Your Network Connection.'
              })
                  .then(function (result) {
                      if (!result) {
                          ionic.Platform.exitApp();
                      }
                      else{
                          ionic.Platform.exitApp();
                      }
                  });
          }
      }

    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})
.config(function ($stateProvider,$urlRouterProvider) {
        $stateProvider
            .state(
            'tabs',{
                url:'/tab',
                abstract:true,
                templateUrl:'templates/tabs.html'
            })
            .state(
                'tabs.todos',{
                    url:'/todos',
                    views: {
                        'todo-tab': {
                            templateUrl: 'templates/todos.html'
                        }
                    }
                }
            )
            .state(
                'tabs.add_todo',{
                    url:'/addTodo',
                    views: {
                        'add_todo-tab': {
                            templateUrl: 'templates/addTodo.html'
                        }
                    }
                }
            )
        $urlRouterProvider.otherwise('/tab/todos');
    })