$(function() {

	var rave = new buzz.sound("http://182.48.54.40/rave",{
		formats: [ "ogg", "mp3" ],
	    preload: true,
	    autoplay: false
	});

	rave.bind("playing", function(e) {
		console.log('fever!!!!');
		fever();
	});

	$('#fever').click(function() {
		rave.play();
	});

	$(window).scroll(function(e) {
		parallax();
	});

	$(window).resize(function(e) {
		$('.flyer').css({'height':$(document).width()*1.3});
	});

    $(document).ready(function(e){
        setInterval(fireworks, 1500);
    });
 
	function parallax() {
		var scrolled = $(window).scrollTop();
		$('#bg').css('top',-(scrolled*0.14)+'px');
	}
});

var wrapper = $('.wrapper');

function fireworks() {
    console.log("fireworks");
    $.getJSON('/app/users', function(data, status, xhr){
        $.each(data.users, function(idx, user){
            var rand_x = Math.floor(Math.random()*90);
            var rand_y = Math.floor(Math.random()*80);
            wrapper.append('<img src="'+user.ieiriIcon+'" class="fireworks" style="width:200px;height:200px;left:'+rand_x+'%; top:'+rand_y+'%;" />');
            $('.fireworks').fadeOut(5000).queue(function() { this.remove(); });
        });
    });
}


var rainbow_count = $('.rainbow').size();
var $h2 = $('h2');
var $rainbow = $('.rainbow');
var $span = $('span');

function fever() {
	$h2.kabuki().rainbow();

	setInterval('beat()', 460);

	for (var i=0; i<rainbow_count; i++) {
		console.log('rainbow');
		$rainbow.eq(i).kabuki().rainbow();
		$rainbow.eq(i).children('a').kabuki().rainbow();
	}
}

function beat() {
	console.log('beat');
	$h2.animate({scale:'1.5'},30).delay(60).animate({scale:'1.0'},30);
	$h2.animate({rotate: '+=360deg', scale: '3.0'}, 120);
	$('.fireworks').animate({rotate: '+=360deg', scale: '1.0'}, 120);
	$span.animate({rotate:'+=360deg',scale:'2.5'},400).delay(10).animate({scale:'1.0'},10);
}






