var slotLeft;
var slotCenter;
var slotRight;

var slotRollLeft;
var slotRollCenter;
var slotRollRight;

var $slotLeft;
var $slotCenter;
var $slotRight;
var $slotRestart;

$(function() {

	var rave = new buzz.sound("http://182.48.54.40/rave",{
		formats: [ "ogg", "mp3" ],
	    preload: true,
	    autoplay: false
	});

	rave.bind("playing", function(e) {
		fever();
	});

    //スロットのjqueryオブジェクトをキャッシュ
    $slotLeft = $('#slot-left');
    $slotCenter = $('#slot-center');
    $slotRight = $('#slot-right');
    $slotRestart = $('#slot-restart');

    //スロット回転開始
    slotStart();

    //スロットの左のストップボタンが押された時の処理
    $('#slot-stop-left').click(function() {
        clearTimeout(slotStopLeft);
        slotLeft = $slotLeft.attr('data-yama');

        $slotLeft.addClass('stop');

        if ($slotLeft.hasClass('stop') && $slotCenter.hasClass('stop') && $slotRight.hasClass('stop')) {
            if (slotLeft == slotCenter && slotLeft == slotRight) {
                fever();
            } else {
                $slotRestart.fadeIn();
            }
        }
    });

    //スロットの中央のストップボタンが押された時の処理
    $('#slot-stop-center').click(function() {
        clearTimeout(slotStopCenter);
        slotCenter = $slotCenter.attr('data-yama');

        $slotCenter.addClass('stop');

        if ($slotLeft.hasClass('stop') && $slotCenter.hasClass('stop') && $slotRight.hasClass('stop')) {
            if (slotLeft == slotCenter && slotLeft == slotRight) {
                bird();
            } else {
                $slotRestart.fadeIn();
            }
        }
    });

    //スロットの右のストップボタンが押された時の処理
    $('#slot-stop-right').click(function() {
        clearTimeout(slotStopRight);
        slotRight = $slotRight.attr('data-yama');

        $slotRight.addClass('stop');

        if ($slotLeft.hasClass('stop') && $slotCenter.hasClass('stop') && $slotRight.hasClass('stop')) {
            if (slotLeft == slotCenter && slotLeft == slotRight) {
                bird();
            } else {
                $slotRestart.fadeIn();
            }
        }
    });

    //スロットの再スタートボタンが押された時の処理
    $slotRestart.click(function() {
        slotStart();
        $(this).fadeOut();
    });

	$(window).scroll(function(e) {
		parallax();
	});

    $(document).ready(function(e){
        setInterval(fireworks, 2000);
        loadYoutube();
    });

    $('.kurenai').mouseover(function(e){
        $('.kurenai').animate({
            width: "95%",
            height: "95%"
        }, 3500, "easeInOutCubic");
    });
    $('.kurenai').mouseout(function(e){
        $('.kurenai').animate({
            width: "80px",
            height: "60px"
        }, 500)
    });
 
	function parallax() {
		var scrolled = $(window).scrollTop();
		$('#bg').css('top',-(scrolled*0.14)+'px');
	}
});

var wrapper = $('.wrapper');

var currentVideo = null;
var videoList = [
    "j1UflQ0WeR0", // 紅
    "t6IjYGHH01M", // 中川智晴
    "Hnmxq5F22Vk", // 五十嵐政一
    "B-tdPNUA-20", // 家入一真
    "j1UflQ0WeR0", // 紅
    "XAbdejm4Ew8", // バシャール　超シンプルな物理学
    "Pfr309Lx8cA", // バシャール　人生はゲーム
    "QNaip71ZO5Y", // バシャール　パラレルな地球
    "lDP96C1x3ok", // バイノーラルビート
    "j1UflQ0WeR0", // 紅
    "1pMdojmmxZY", // さかなクンちょっと狂っちゃった
    "d9_0LFNMx7s", // さかなdeラップ
    "j1UflQ0WeR0" // 紅
    //"rd5LCpImgic", // マック赤坂　埋め込み無効
    //"-U71wYvd_Xg", // 中川智晴　埋め込み無効
];
function loadYoutube() {
    currentVideo = videoList[Math.floor(Math.random() * videoList.length)];
    var youtubeUrl = "//www.youtube.com/embed/"+currentVideo+"?rel=0&controls=0&showinfo=0&autoplay=1&loop=1&cc_load_policy=1&vq=hd720";
    console.log(youtubeUrl)
    $("#kurenai").attr("src", youtubeUrl);
};

var sizeList = ["20","40","50","80","100","150","200","250"];
var params = {page:1, per_page:15, total:null, rest:null}
function fireworks() {
    $.getJSON('/app/users', params, function(data, status, xhr){
        params.total = data.total;
        params.rest = data.total-(data.per_page*data.page);
        if (params.rest > 0) {
            params.page = parseInt(data.page)+1;
        } else {
            params.page = 1;
        }
        $.each(data.users, function(idx, user){
            var rand_x = Math.floor(Math.random()*90);
            var rand_y = Math.floor(Math.random()*80);
            var size = sizeList[Math.floor(Math.random() * sizeList.length)];
            wrapper.append('<img src="'+user.ieiriIcon+'" class="fireworks" style="width:'+size+'px;height:'+size+'px;left:'+rand_x+'%; top:'+rand_y+'%;" />');
            $('.fireworks').fadeOut(50000).queue(function() { this.remove(); });
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

function slotStart() {
    slotRollLeft();
    slotRollCenter();
    slotRollRight();

    $slotLeft.removeClass('stop');
    $slotCenter.removeClass('stop');
    $slotRight.removeClass('stop');
}

function slotRollLeft() {
    var rand = Math.floor(Math.random()*10);
    $slotLeft.css({'backgroundImage': 'url(assets/img/slot-'+rand+'.jpg)'});
    $slotLeft.attr({'data-yama': rand});
    slotStopLeft = setTimeout("slotRollLeft();", 100);
}

function slotRollCenter() {
    var rand = Math.floor(Math.random()*10);
    $slotCenter.css({'backgroundImage': 'url(assets/img/slot-'+rand+'.jpg)'});
    $slotCenter.attr({'data-yama': rand});
    slotStopCenter = setTimeout("slotRollCenter();", 100);
}

function slotRollRight() {
    var rand = Math.floor(Math.random()*10);
    $slotRight.css({'backgroundImage': 'url(assets/img/slot-'+rand+'.jpg)'});
    $slotRight.attr({'data-yama': rand});
    slotStopRight = setTimeout("slotRollRight();", 100);
}