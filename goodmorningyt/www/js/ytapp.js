/**
 * Created by dandooley on 3/06/16.
 */

var app = angular.module("GoodMorningYT", []);

var ytapi = "https://www.googleapis.com/youtube/v3";

var apikey = "AIzaSyCyI7IT-kHhYJ92ahtQxtr_AhZBMMKjBYI";

app.controller("gmytController", ["$http", "$scope", function($http, $scope){
    var gmyt = this;

    gmyt.user = null;

    gmyt.login = function(){
        window.location = '/goodmorningyt/auth';
    };

    gmyt.date = new Date();

    gmyt.loadSubs = function(pageToken){
        if (pageToken){
            $http({
                method: 'GET',
                url: ytapi + "/subscriptions?part=snippet&mine=true&maxResults=50&pageToken=" + pageToken +"&key=" + apikey,
                headers: {
                    "Authorization": "Bearer " + gmyt.user.google.token
                }
            }).then(function (response) {
                console.log(response);
                for (var i = 0; i < response.data.items.length; i++){
                    gmyt.subs.push(response.data.items[i]);
                }
                if (response.data.nextPageToken) {
                    gmyt.loadSubs(response.data.nextPageToken);
                } else {
                    gmyt.processSubs();
                }
            }, function (response) {
                toastr.error("An error occurred when requesting Subscription information from YouTube. Please relogin and see if the issue occurs again.");
            });
        } else {
            $http({
                method: 'GET',
                url: ytapi + "/subscriptions?part=snippet&mine=true&maxResults=50&key=" + apikey,
                headers: {
                    "Authorization": "Bearer " + gmyt.user.google.token
                }
            }).then(function (response) {
                console.log(response);
                gmyt.subs = response.data.items;
                if (response.data.nextPageToken) {
                    gmyt.loadSubs(response.data.nextPageToken);
                } else {
                    gmyt.processSubs();
                }
            }, function (response) {
                toastr.error("An error occurred when requesting Subscription information from YouTube. Please relogin and see if the issue occurs again.");
            });
        }
    };

    gmyt.addSub = function(sub){
        sub.selected = true;
        gmyt.user.morning.subs.push({
            name: sub.snippet.title,
            channelId: sub.snippet.resourceId.channelId
        });
    };

    gmyt.removeSub = function(sub){
        sub.selected= false;
        for (var i = 0; i < gmyt.user.morning.subs.length; i++){
            if (gmyt.user.morning.subs[i].channelId === sub.snippet.resourceId.channelId){
                gmyt.user.morning.subs.splice(i, 1);
            }
        }
    };

    gmyt.processSubs = function(){
        if (gmyt.user.morning) {
            for (var i = 0; i < gmyt.user.morning.subs.length; i++) {
                var selSub = gmyt.user.morning.subs[i];
                for (var j = 0; j < gmyt.subs.length; j++){
                    if (gmyt.subs[j].snippet.resourceId.channelId === selSub.channelId){
                        gmyt.subs[j].selected = true;
                    }
                }
            }
        }
    };

    gmyt.subup = function(sub){
        var index = gmyt.user.morning.subs.indexOf(sub);
        if (index > 0){
            var temp = gmyt.user.morning.subs[index - 1];
            gmyt.user.morning.subs[index - 1] = sub;
            gmyt.user.morning.subs[index] = temp;
        }
    };

    gmyt.subdown = function(sub){
        var index = gmyt.user.morning.subs.indexOf(sub);
        if (index < gmyt.user.morning.subs.length - 1){
            var temp = gmyt.user.morning.subs[index + 1];
            gmyt.user.morning.subs[index + 1] = sub;
            gmyt.user.morning.subs[index] = temp;
        }
    };

    gmyt.subtrash = function(sub){
        gmyt.user.morning.subs.splice(gmyt.user.morning.subs.indexOf(sub), 1);
        for (var i = 0; i < gmyt.subs.length; i++){
            if (sub.channelId === gmyt.subs[i].snippet.resourceId.channelId){
                gmyt.subs[i].selected = false;
            }
        }
    };

    gmyt.play = function (){
        if (gmyt.user.morning.subs.length < 1) {
            toastr.error("Please select at least one Subscription.");
        } else {
            gmyt.videoList = [];
            gmyt.buildVidList(0);
        }
    };

    gmyt.ytblock = true;

    gmyt.buildVidList = function(index){
        var startDate = moment(gmyt.date).utc().subtract(1, 'd').toISOString();
        var endDate = moment(gmyt.date).utc().toISOString();
        $http({
            method: 'GET',
            url: ytapi + '/search?part=snippet&type=video&channelId=' + gmyt.user.morning.subs[index].channelId + '&publishedAfter=' + startDate + '&publishedBefore=' + endDate + "&key=" + apikey
        }).then(function(response){
            for (var i = 0; i < response.data.items.length; i++){
                gmyt.videoList.push(response.data.items[i].id.videoId);
            }
            index++;
            if (index < gmyt.user.morning.subs.length){
                gmyt.buildVidList(index);
            } else {
                if (gmyt.videoList.length > 0) {
                    console.log(gmyt.videoList);
                    toastr.info("Loading playlist of length: " + gmyt.videoList.length);
                    gmyt.startPlayback();
                } else {
                    toastr.error("No videos for this Subscriber list + Date");
                }
            }
        }, function(response){
            toastr.error("Error building video list :(");
        })
    };

    gmyt.startPlayback = function(){
        gmyt.ytblock = false;
        gmyt.player.loadPlaylist(gmyt.videoList);
        gmyt.player.playVideo();
    };

    gmyt.save = function(){
        $http({
            method: "POST",
            url: "/goodmorningyt/api/saveUser",
            data: gmyt.user
        }).then(function(response){
            toastr.success('Successfully Saved');
        }, function(response){
            if (response.data.err){
                toastr.error(response.data.err);
            }
        })
    };

    // Startup Functions

    gmyt.loading = true;
    setTimeout(function() {
        gmyt.toLoad = 2;
        $http({
            method: 'GET',
            url: '/goodmorningyt/api/getUser'
        }).then(function (response) {
            console.log(response);
            if (!response.data.err) {
                gmyt.user = response.data;
                gmyt.updateMaterialSelect();
            }
            gmyt.toLoad--;
            gmyt.isLoaded();
        });

        gmyt.youTubeCheck = function(){
            console.log("checking youtube");
            if (YTready){
                gmyt.toLoad--;
                gmyt.isLoaded();
		$scope.$apply();
            } else {
                setTimeout(gmyt.youTubeCheck, 100);
            }
        };
        setTimeout(gmyt.youTubeCheck, 100);

        gmyt.isLoaded = function () {
            if (gmyt.toLoad === 0) {
                gmyt.loaded = true;
                $('#loading').fadeOut(1000, function (){
                    delete gmyt.loading;
		    gmyt.player = new YT.Player('YT');
                });
            }
        };

    }, 1000);

    gmyt.updateMaterialSelect = function(){
        $('.mdb-select').material_select();
    };



    console.log("Page Controller intitalised");
}]);

app.filter("subSort", function(){
    return function(subs){
        var result = [];
        if (subs) {
            for (var i = 0; i < subs.length; i++) {
                if (subs[i].selected) {
                    result.push(subs[i]);
                }
            }
            for (var i = 0; i < subs.length; i++) {
                if (!subs[i].selected) {
                    result.push(subs[i]);
                }
            }
            return result;
        }
    }
});

//YouTube player code

var YTready = false;
function onYouTubeIframeAPIReady() {
    console.log("YouTube API Loaded");
    YTready = true;
}
