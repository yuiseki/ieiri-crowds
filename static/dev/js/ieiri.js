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

    $('.move-left').mouseover(function(){
        $(this).animate({'right': '+=10px'},2000);
    });
    $('.move-right').mouseover(function(){
        $(this).animate({'left': '+=10px'},2000);
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
                fever();
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
                fever();
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

    $(document).ready(function(e){
        setInterval(fireworks, 3000);
        lazyLoadContents();
        mouseIeiri();
        numberOfVotes();
    });

    $('.kurenai').mouseover(function(e){
        $('.kurenai').stop().animate({
            width: "95%",
            height: "95%"
        }, 3500, "easeInOutCubic");
    });
    $('.kurenai').mouseout(function(e){
        $('.kurenai').stop().animate({
            width: "80px",
            height: "60px"
        }, 500)
    });

    setInterval("removeFireworks()", 20000);
});

function removeFireworks() {
    $('.fireworks').remove();
}

var wrapper = $('.wrapper');

function lazyLoadContents(){
    loadYoutube(function(){
        loadTweetButtons(function(){
            loadIframes();
        });
    });
};

var currentVideo = null;
var videoList = [
    "j1UflQ0WeR0", // 紅
    "17jymDn0W6U", // the known universe
    "j1UflQ0WeR0", // 紅
    "XAbdejm4Ew8", // バシャール　超シンプルな物理学
    "Pfr309Lx8cA", // バシャール　人生はゲーム
    "QNaip71ZO5Y", // バシャール　パラレルな地球
    "lDP96C1x3ok", // バイノーラルビート
    "j1UflQ0WeR0", // 紅
    "1pMdojmmxZY", // さかなクンちょっと狂っちゃった
    "d9_0LFNMx7s", // さかなdeラップ
    "j1UflQ0WeR0", // 紅
    "C8xiy1JZbNk", // funny animal 2014
    "LSbnECOt5WA", // シンガポールナイトサファリ (ショー)
    "kfLbhmQkzOY", // シンガポールナイトサファリ (ツアー)
    "j1UflQ0WeR0", // 紅
    "EXfv9siATj0", // Hemi-sync - journeys out of the body
    "3NKVzsPjMLY", // Hemi-sync - Dreamcatcher
    "j1UflQ0WeR0" // 紅
    //"B-tdPNUA-20", // 家入一真 公職選挙法違反の可能性
    //"t6IjYGHH01M", // 中川智晴
    //"Hnmxq5F22Vk", // 五十嵐政一
    //"rd5LCpImgic", // マック赤坂　埋め込み無効
    //"-U71wYvd_Xg", // 中川智晴　埋め込み無効
];
function loadYoutube(done) {
    currentVideo = videoList[Math.floor(Math.random() * videoList.length)];
    var youtubeUrl = "//www.youtube.com/embed/"+currentVideo+"?rel=0&controls=0&showinfo=0&autoplay=1&loop=1&cc_load_policy=1&vq=hd720";
    console.log("loadYoutube", youtubeUrl);
    $("#kurenai").attr("src", youtubeUrl).load(done());
};
//
function loadTwitterWidgets() {
    console.log("loadTwitterWidgets");
    !function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0],p=/^http:/.test(d.location)?'http':'https';if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src=p+'://platform.twitter.com/widgets.js';fjs.parentNode.insertBefore(js,fjs);}}(document, 'script', 'twitter-wjs');
}
function loadTweetButtons(done) {
    console.log("loadTweetButtons");
    langList = [
        "ru", "fr", "ar", "es", "ko", "ru", "fil", "zh-tw", "zh-ch", "hi",
        "ru", "fr", "ar", "es", "ko", "ru", "fil", "zh-tw", "zh-ch", "hi"
    ];
    $.each(langList, function(idx, lang){
        button = $("<div class='twbtn'><a class='twitter-share-button' href='https://twitter.com/share'>Tweet</a></div>");
        button = button.find("a").attr({
            "data-url":"http://ieirikazuma.com/",
            "data-via":"hbkr",
            "data-related":"hbkr",
            "data-hashtags":"非公式ぼくらの政策",
            "data-size":"large",
            "data-lang":lang,
        });
        $("#tweetbuttons").append(button);
        if(idx == langList.length-1){
            loadTwitterWidgets();
            done();
        }
    });

}
function loadIframes(done) {
    console.log("loadIframes");
}


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
        });
    });
}

function mouseIeiri() {
    var ganmen = $("<div class='ganmen'><img src='/ieiri-tiny.png'></div>")
    $(ganmen).css({width:'100px', height:'100px', overflow:'hidden', position:'absolute', top:'0', left:'0'});
    $('body').append(ganmen);
    $('html').mousemove(function(e){
        var icon = $(ganmen).offset();
        $(ganmen).stop();
        $(ganmen).animate({
            top:e.pageY+50,
            left:e.pageX+50
            },{
                duration: 1000,
                specialEasing:{
                    top:'easeOutCirc',
                    left:'easeOutCirc'
                }});
    });
}

function numberOfVotes() {
    var unixtime = Math.floor(new Date().getTime()/1000);
    var num = unixtime*0.000001;
    num *= 1.0;
    var keta = ['万', '億', '兆', '京', '垓', '𥝱', '穣', '溝', '澗', '正', '載', '極', '恒河沙', '阿僧祇', '那由他', '不可思議', '無量大数'];
    var text = '';
    for ( var i = keta.length - 1; i >= 0; i-- ) {
        var num2 = Math.floor( num / Math.pow( 10, i * 4 ) );
        if ( num2 > 0 ) {
            text += num2 + keta[i];
            num = num % Math.pow( 10, i * 4 );
        }
    }
    document.title = "東京都知事候補者 家入一真  予想得票数 "+text+"票 非公式ホームページ";
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
	$h2.animate({scale:'1.5'},30).delay(60).animate({scale:'1.0'},30);
	$h2.animate({rotate: '+=360deg', scale: '3.0'}, 120);
	$('.fireworks').animate({rotate: '+=360deg', scale: '2.0'}, 200);
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
    var rand = Math.floor(Math.random()*7);
    $slotLeft.css({'backgroundImage': 'url(assets/img/slot-'+rand+'.jpg)'});
    $slotLeft.attr({'data-yama': rand});
    slotStopLeft = setTimeout("slotRollLeft();", 250);
}

function slotRollCenter() {
    var rand = Math.floor(Math.random()*7);
    $slotCenter.css({'backgroundImage': 'url(assets/img/slot-'+rand+'.jpg)'});
    $slotCenter.attr({'data-yama': rand});
    slotStopCenter = setTimeout("slotRollCenter();", 250);
}

function slotRollRight() {
    var rand = Math.floor(Math.random()*7);
    $slotRight.css({'backgroundImage': 'url(assets/img/slot-'+rand+'.jpg)'});
    $slotRight.attr({'data-yama': rand});
    slotStopRight = setTimeout("slotRollRight();", 250);
}
