/**
 * Created by dandooley on 5/02/16.
 */

var app = angular.module('app', []);


app.controller('EditController', ['$http', function ($http) {

    var edit = this;
    edit.cv = {};
    edit.port = {};
    console.log("Controller Initialised");

    edit.res = {};
    edit.res.selected = undefined;
    edit.res.addVis = false;
    edit.res.blankDet = false;
    edit.res.tag = "";
    edit.res.detailAdd = function () {
        edit.res.add = {
            title: "",
            description: ""
        };
        edit.overlay = true;
        edit.res.addVis = true;
    };
    edit.res.confirm = function () {
        if (edit.res.add.title !== "") {
            edit.selected.details.push(edit.res.add);
        }
        edit.overlay = false;
        edit.res.addVis = false;
        edit.res.blankDet = (edit.selected.details.length === 0);
        edit.res.selected = edit.selected.details[edit.selected.details.length - 1];
    };
    edit.res.detailRemove = function () {
        var index = edit.selected.details.indexOf(edit.res.selected);
        edit.selected.details.splice(index, 1);
        edit.res.blankDet = (edit.selected.details.length === 0);
        edit.res.selected = edit.selected.details[0];
    };
    edit.res.addTag = function () {
        edit.selected.tags.push(edit.res.tag);
        edit.res.tag = "";
    };
    edit.res.removeTag = function (tag) {
        var index = edit.selected.tags.indexOf(tag);
        edit.selected.tags.splice(index, 1);
    };

    edit.por = {};
    edit.por.image = function () {
        if (edit.selected.image.indexOf("http") === -1) {
            return '../' + edit.selected.image;
        } else {
            return edit.selected.image
        }
    };

    edit.up = function(){
        var item = edit.selected;
        var array;
        switch(item.type){
            case 'education':
                array = edit.cv.json.education;
                break;
            case 'experience':
                array = edit.cv.json.experience;
                break;
            case 'portfolio':
                array = edit.port.json;
                break;
        }
        var index = array.indexOf(item);
        if (index > 0){
            var temp = array[index - 1];
            array[index - 1] = item;
            array[index] = temp;
        }
    };

    edit.down = function(){
        var item = edit.selected;
        var array;
        switch(item.type){
            case 'education':
                array = edit.cv.json.education;
                break;
            case 'experience':
                array = edit.cv.json.experience;
                break;
            case 'portfolio':
                array = edit.port.json;
                break;
        }
        var index = array.indexOf(item);
        if (index < array.length - 1){
            var temp = array[index + 1];
            array[index + 1] = item;
            array[index] = temp;
        }
    };

    edit.add = function (type) {
        var add;
        switch (type) {
            case 'education':
                add = {
                    tags: [],
                    title: 'New Entry',
                    type: type,
                    info: '',
                    start: '',
                    end: '',
                    details: [],
                    selected: true
                };
                edit.cv.json.education.push(add);
                edit.selected = add;
                break;
            case 'experience':
                add = {
                    tags: [],
                    title: 'New Entry',
                    type: type,
                    info: '',
                    start: '',
                    end: '',
                    details: [],
                    selected: true
                };
                edit.cv.json.experience.push(add);
                edit.selected = add;
                break;
            case 'portfolio':
                add = {
                    name: '',
                    type: "portfolio",
                    title: 'New Entry',
                    subtitle: '',
                    link: '',
                    image: '',
                    btnText: '',
                    category: '',
                    "text": ''
                };
                edit.port.json.push(add);
                edit.select(add);
                break;
        }
    };

    edit.delete = function(){
        var item = edit.selected;
        var array;
        switch(item.type){
            case 'education':
                array = edit.cv.json.education;
                break;
            case 'experience':
                array = edit.cv.json.experience;
                break;
            case 'portfolio':
                array = edit.port.json;
                break;
        }
        var index = array.indexOf(item);
        array.splice(index, 1);
        edit.selected = undefined;
    };

    edit.selected = undefined;
    edit.select = function (sel) {
        if (edit.selected) {
            edit.selected.selected = false;
        }
        edit.selected = sel;
        edit.selected.selected = true;

        if (edit.selected.type === "education" || edit.selected.type === "experience") {
            edit.res.selected = edit.selected.details[0];
            edit.res.blankDet = (edit.selected.details.length === 0);
        }
    };

    edit.overlay = false;

    edit.saveVis = false;
    edit.saveStart = function(){
        edit.overlay = true;
        edit.saveVis = true;
    };
    edit.saveDisabled = false;
    edit.save = function(){
        var output = {};
        if (edit.selected) {
            edit.selected.selected = false;
        }
        edit.selected = undefined;
        output.cv = edit.cv.json;
        output.portfolio = edit.port.json;

        edit.saveDisabled = true;

        console.log(output);
        var password = edit.password;
        edit.password = "";

        $http({
            method: 'GET',
            url: 'http://dooley.ac.nz/adminedit/getkey'
        }).then(function(response){
            var key = response.data.key;

            var publickey = openpgp.key.readArmored(key);

            openpgp.encryptMessage(publickey.keys, password).then(function(message){
                output.password = message;
                console.log(output);

                $http({
                    method: "POST",
                    url: "http://dooley.ac.nz/adminedit/save/",
                    data: output
                }).then(function(response){
                    alert("Saved Successfully");
                    edit.saveDisabled = false;
                    edit.saveVis = false;
                    edit.overlay = false;
                }, function(response){
                    console.log("Error performing save - " + response.status);
                    console.log(response.data);
                    alert(response.data);
                    edit.saveDisabled = false;
                    edit.saveVis = false;
                    edit.overlay = false;
                })
            }).catch(function(error){
                console.log("Error encrypting message:");
                console.log(error);
                alert(error);
                edit.saveDisabled = false;
                edit.saveVis = false;
                edit.overlay = false;
            })
        }, function(response){
            console.log("Error retrieving key - " + response.status);
            console.log(response.data);
            alert(response.data);
            edit.saveDisabled = false;
            edit.saveVis = false;
            edit.overlay = false;
        })
    };


    $http({
        method: "GET",
        url: "../json/cv.json"
    }).then(function (response) {
        edit.cv.json = response.data;
        console.log(edit);
    });

    $http({
        method: "GET",
        url: "../json/portfolio.json"
    }).then(function (response) {
        edit.port.json = response.data;
    });


}]);