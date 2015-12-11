angular.module('starter_todo')
    .constant("url",'firebase app url') //Place your firebase project url

    .factory('userDetails', function ($firebaseArray, url, $firebaseObject,$ionicLoading) {

        var ref = null;
        var user=null;
        var sync=null;
        var sync_fb=null;


        var flag=false;

        function showLoginDialog(){

            ref=new Firebase(url).child("/users");
            sync=$firebaseArray(ref);
            sync_fb=$firebaseArray(ref);


            ref.authWithOAuthPopup("facebook", function(error, authData) {
                if (error) {
                    console.log("Login Failed!", error);

                    $ionicLoading.show({ template: 'error', noBackdrop: true, duration: 2000 });

                    ref = new Firebase(url).child("/public");
                    sync=$firebaseArray(ref);

                    flag=false;

                    return sync;

                } else {
                    console.log("Authenticated successfully with payload:", authData);

                    user = authData;

                    var log_uid = [];

                    for (var x in sync_fb) {
                        if (sync_fb[x].userId != null) {
                            log_uid.push(sync_fb[x].userId);
                        }
                    }

                    $ionicLoading.show({ template: user.facebook.displayName, noBackdrop: true, duration: 2000 });

                    console.log("Authenticated data:");

                    if (log_uid.indexOf(user.uid) == -1) {


                        var Data = {
                            Name: user.facebook.displayName,
                            profileImg: user.facebook.profileImageURL,
                            userId: user.uid
                        }
                        sync_fb.$add(Data);
                    }

                    if(authData!=null)
                    {
                        flag=true;

                        console.log("Authenticated");

                        ref = new Firebase(url).child("/private/").child(user.uid);
                        sync_fb = $firebaseArray(ref);

                        console.log(sync_fb);

                        return sync_fb
                    }

                }
            });

        };


        function store_todo(task,mode) {
            if(mode==true) {
                storeTodo_private(task);
            }
            else {
                console.log(task);
                storeTodo_public(task);
            }
        }

        var storeTodo_private = function(task){

            ref=new Firebase(url).child("/private/").child(user.uid);
            sync_fb=$firebaseArray(ref);
            var todo={toDo:task,profileImg:user.facebook.profileImageURL};
            sync_fb.$add(todo);
        };

        var storeTodo_public = function(task){

            if(flag==true) {
                ref = new Firebase(url).child("/public");
                sync = $firebaseArray(ref);
            }

            var img;

            if(user!=null)
            {
                img=user.facebook.profileImageURL;
            }
            else
            {
                img='img/person.png';
            }

            var todo={toDo:task,profileImg:img};
            sync.$add(todo);
        };

        function logout() {

            //console.log(ref.getAuth());

            ref.unauth();

            console.log(ref.getAuth());

            flag=false;

            user=null;

            ref = new Firebase(url).child("/public");

            sync = $firebaseArray(ref);

        }


        function showTodo() {

            ref = new Firebase(url).child("/public");

            sync = $firebaseArray(ref);

            return sync;
        };

        return {
            showTodo: showTodo,
            showLoginDialog: showLoginDialog,
            logout:logout,
            syncData:function () {

                if(user!=null)
                {
                    return sync_fb;
                }
                else{
                    return sync;
                }

            },
            returnFlagCheck: function () {
              return flag;
            },
            userName: function () {
                if(user!=null) {
                    return user.facebook.displayName;
                }
            },
            delete_todo: function (task) {
                if(user==null)
                {
                    console.log(sync);
                    sync.$remove(task);

                }
                else {
                    sync_fb.$remove(task);
                }
            },

            store_todo:store_todo
         };

    })

