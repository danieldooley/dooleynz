/**
 * Created by daniel on 3/10/15.
 */

function fillNav(items){
    var nav = {};
    nav.port = items;
    nav.html = '';
    var prevCat = '';
    for (var i = 0; i < nav.port.length; i++) {
        var item = nav.port[i];
        if (item.category !== prevCat) {
            if (i !== 0) {
                nav.html += '<li role="separator" class="divider"></li>';
            }
            nav.html += '<li class="dropdown-header">' + item.category + '</li>';
            prevCat = item.category;
        }
        nav.html += '<li><a class="dd pp" href="#portfolio" id="nav' + item.name + '">' + item.title + '</a></li>';

    }

    $('#navfill').html(nav.html);

    $('.pp').click(function(){
        var s = $(this).attr('id').slice(3);
        $('#pill' + s).click();
    });
}

$(document).ready(function(){
    //perform necessary size changes
    $(window).resize(function(){
        var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
        $('.section').each(function(index, element){
           $(element).css('min-height', h - 51);
        });
    });
    $(window).resize();

    //auto-close dropdown menu
    $('.dd').click(function(){
        var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
        $('.dropdown-toggle').dropdown("toggle");
        if (w < 768) {
            $('.navbar-toggle').click();
        }
    });

    //set active link appropriately
    $(window).scroll(function(){
        var curr_position = $(this).scrollTop();
        $('.section').each(function(){
           var top = $(this).offset().top - 51,
               bottom = top + $(this).outerHeight() - 1;

            if (curr_position >= top && curr_position <= bottom){
                $('#navbar').find('.main').removeClass('active');

                $('#navbar').find('#n'+$(this).prev().attr('id')).addClass('active');
            }
        });
    });
    $(window).scroll();

    //select correct portfolio item from the navbar


    $(document).ready(function(){
        //$('#portpill').children('li').first().addClass('active');


    });
});