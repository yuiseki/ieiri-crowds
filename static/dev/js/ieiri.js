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
 
	function parallax() {
		var scrolled = $(window).scrollTop();
		$('#bg').css('top',-(scrolled*0.14)+'px');
	}
});

var wrapper = $('.wrapper');

function fireworks() {
	for (var i=0; i<4; i++) {
		var rand_x = Math.floor(Math.random()*90);
		var rand_y = Math.floor(Math.random()*80);
		wrapper.append('<img src="'+img[i]+'" class="fireworks" style="left:'+rand_x+'%; top:'+rand_y+'%;" />');
	}
	$('.fireworks').fadeOut(1200).queue(function() { this.remove(); });
}

var img = new Array();
img[0] = 'http://static.tumblr.com/6h2rxc4/xkzmwyk4q/tumblr_m7vp7ulcrt1qzu3e6o2_250.gif';
img[1] = 'http://static.tumblr.com/6h2rxc4/Dl8mwyk7h/tumblr_m7vp7ulcrt1qzu3e6o2_250.gif';
img[2] = 'http://static.tumblr.com/6h2rxc4/kBAmwyk85/tumblr_m7vp7ulcrt1qzu3e6o2_250.gif';
img[3] = 'http://static.tumblr.com/6h2rxc4/lrpmwyk9l/tumblr_m7vp7ulcrt1qzu3e6o2_250.gif';
img[4] = 'http://static.tumblr.com/6h2rxc4/6lRmwykak/tumblr_m7vp7ulcrt1qzu3e6o2_250.gif';


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






