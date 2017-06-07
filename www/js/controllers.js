/**
 * Created by daniel on 3/10/15.
 */
(function(){
    var app = angular.module('portfolio', ['ngSanitize']);

    app.controller('PortfolioController', ['$http', function($http){
        var port = this;
        port.items = [];
        $http.get('json/portfolio.json').then(function(response){
            console.log('successfully pulled portfolio items');
            port.items = response.data;
            fillNav(port.items);
        }, function(response){
            console.log('failed to pull portfolio items with error code: ' + response.statusText);
            port.items = [{
                name: 'unavailable',
                title: 'Portfolio Unavailable',
                subtitle: 'Error Code: ' + response.statusText,
                link: '',
                image: '',
                btnText: undefined,
                category: 'Error',
                text: 'Unfortunately it seems an error occurred. Please contact me using the above form or try again later.'

            }];
            fillNav(port.items);
        })
    }]);

    app.controller('MailController',['$scope', function($scope){
        var mail = this;
        mail.subject = "General Inquiry";
        mail.body = "";
        mail.sender = "";

        mail.send = function(){
            $.ajax({
                type: 'POST',
                url: 'http://dooley.ac.nz/contact/',
                data: {
                    sender: mail.sender,
                    subject: mail.subject,
                    message: mail.body,
                    datatype: 'json'
                }
            }).done(function(data){
                alert('Message Sent!');
                mail.subject = "General Inquiry";
                mail.body = "";
                mail.sender = "";
                $scope.$apply();
            }).fail(function(data){
                alert('Message failed to sent. Please try again later or email me directly at dan@dooley.ac.nz');
            });
        }
    }]);

    app.filter('encodeURIComponent', function(){
        return window.encodeURIComponent;
    });

    app.controller('CVController', ['$http', function($http){
       var cv = this;
        cv.resume = {};
        $http.get('json/cv.json').then(function(response){
            console.log("successfully pulled cv data");
            cv.resume = response.data;
        }, function(response){
            console.log('failed to pull cv items with error code: ' + response.statusText);
            cv.resume = {
                "details": {
                    "name": "Dan Dooley",
                    "email": "Oops. It seems there",
                    "website": "was an error!",
                    "phone": "",
                    "address1": "Contact me using the form",
                    "address2": " below or please try",
                    "address3": "again later.",
                    "postcode": ""
                }
            }
        });

        cv.show = 'brief';



        cv.generatePDF = function(){
            var details = cv.resume.details;
            console.log(cv.resume);

            var doc = new jsPDF();

            var tag = cv.show;


            //Top Header
            doc.setFontSize(35);
            doc.text(72, 25, details.name);

            //Divider
            doc.setDrawColor(210, 210, 210);
            doc.line(20, 30, 190, 30);

            //Details
            doc.setFontSize(15);
            doc.setFontStyle('bold');
            doc.text(30, 40, 'Email:');
            doc.setFontStyle('normal');
            doc.text(50, 40, details.email);

            doc.setFontStyle('bold');
            doc.text(24, 50, 'Website:');
            doc.setFontStyle('normal');
            doc.text(50, 50, details.website);

            doc.setFontStyle('bold');
            doc.text(28, 60, 'Phone:');
            doc.setFontStyle('normal');
            doc.text(50, 60.2, details.phone);

            doc.setFontStyle('bold');
            doc.text(122, 40, 'Address:');
            doc.setFontStyle('normal');
            doc.text(150, 40, details.address1);
            doc.text(150, 46.5, details.address2);
            doc.text(150, 53, details.address3);
            doc.text(150, 60, details.postcode);

            //Divider
            doc.line(20, 65, 190, 65);

            var exp = cv.resume.experience;

            //footer
            doc.setFontSize(10);
            doc.setTextColor(130, 130, 130);
            var date = new Date();
            var dateString = date.getDate() + "/" + date.getMonth() + '/' + date.getFullYear();
            //doc.text(25, 285, 'PDF Generated on ' + dateString + ' using tag \'' + tag + '\'. See my live resume & portfolio at http://' + details.website);

            //Work Experience
            doc.setTextColor(0,0,0);
            doc.setFontSize(25);
            doc.text(20, 78, 'Work Experience:');

            var prev = 80;
            for (var x = 0; x < exp.length; x++) {
                if (exp[x].tags.indexOf(tag) !== -1 || tag === 'all') {
                    if (prev > 250) {
                        doc.addPage();
                        doc.setFontSize(10);
                        doc.setTextColor(130, 130, 130);
                        var date = new Date();
                        var dateString = date.getDate() + "/" + date.getMonth() + '/' + date.getFullYear();
                        //doc.text(25, 285, 'PDF Generated on ' + dateString + ' using tag \'' + tag + '\'. See my live resume & portfolio at http://' + details.website);
                        prev = 10;
                    }
                    doc.setTextColor(0,0,0);
                    doc.setFontSize(18);
                    doc.text(25, prev + 10, exp[x].title);
                    doc.setFontSize(14);
                    doc.setTextColor(100, 100, 100);
                    doc.text(25, prev + 17, exp[x].info + " (" + exp[x].start + " - " + exp[x].end + ")");
                    doc.setTextColor(0, 0, 0);
                    doc.setFontSize(12);
                    var bullPrev = 0;
                    for (var i = 0; i < exp[x].details.length; i++) {
                        doc.text(35, prev + 24 + bullPrev, "•   " + exp[x].details[i].description);
                        bullPrev += 5;
                    }
                    prev += (21 + bullPrev);
                }
            }

            if (prev > 238){
                doc.addPage();
                doc.setFontSize(10);
                doc.setTextColor(130, 130, 130);
                var date = new Date();
                var dateString = date.getDate() + "/" + date.getMonth() + '/' + date.getFullYear();
                //doc.text(25, 285, 'PDF Generated on ' + dateString + ' using tag \'' + tag + '\'. See my live resume & portfolio at http://' + details.website);
                prev = 8;
            }

            var edu = cv.resume.education;

            doc.setFontSize(25);
            doc.setTextColor(0,0,0);
            doc.text(20, prev + 12, 'Education:');

            prev += 14;
            for (var x = 0; x < edu.length; x++){
                if (edu[x].tags.indexOf(tag) !== -1 || tag === 'all') {
                    if (prev > 250) {
                        doc.addPage();
                        doc.setFontSize(10);
                        doc.setTextColor(130, 130, 130);
                        var date = new Date();
                        var dateString = date.getDate() + "/" + date.getMonth() + '/' + date.getFullYear();
                        //doc.text(25, 285, 'PDF Generated on ' + dateString + ' using tag \'' + tag + '\'. See my live resume & portfolio at http://' + details.website);
                        prev = 10;
                    }
                    doc.setTextColor(0,0,0);
                    doc.setFontSize(18);
                    doc.text(25, prev + 10, edu[x].title);
                    doc.setFontSize(14);
                    doc.setTextColor(100, 100, 100);
                    doc.text(25, prev + 17, "(" + edu[x].start + " - " + edu[x].end + ")");
                    doc.setFontSize(12);
                    doc.setTextColor(0, 0, 0);
                    bullPrev = 0;
                    for (var i = 0; i < edu[x].details.length; i++) {
                        doc.text(35, prev + 24 + bullPrev, "•   " + edu[x].details[i].description);
                        bullPrev += 5;
                    }
                    prev += (21 + bullPrev);
                }
            }




            doc.output('datauri')
        }

    }]);

    app.controller('bgController', ['$http', function($http){
        var bg = this;

        bg.img1 = {};
        bg.img2 = {};

        $http({
            url:'http://dooley.ac.nz/terrain/',
            method: 'POST',
            data: {
                x: 200,
                y: 100,
                pixel: 10,
                type: 'NATION'
            }
        }).then(function(response){
            bg.img1 = {
                'background': "url(" + response.data + ") no-repeat center center fixed"
            }
        });

        $http({
            url:'http://dooley.ac.nz/terrain/',
            method: 'POST',
            data: {
                x: 200,
                y: 100,
                pixel: 10,
                type: 'ISLANDPLUS'
            }
        }).then(function(response){
            bg.img2 = {
                'background': "url(" + response.data + ") no-repeat center center fixed"
            }
        });

    }])

})();

