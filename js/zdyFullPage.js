var pageNum = 1;//当前页面
var pageNumAfter;//下一页
var pageNumBefore;//上一页
var res = true;
$(".page").swipe({
    swipeUp: function(event, direction, distance, duration, fingerCount) {
        if (res) {

            res = false;
            pageNumAfter = pageNum + 1;
            if (pageNumAfter > 3) {
                pageNumAfter = 1
            }
            bottomSlide(pageNum,pageNumAfter,'p');
            console.log('上滑 从',pageNum,'页面到',pageNumAfter,'页面');
        }
    },
    swipeDown: function(event, direction, distance, duration, fingerCount) {
        if (res) {
            res = false;
            pageNumBefore = pageNum - 1;
            if (pageNumBefore < 1) {
                pageNumBefore = 3
            }
            topSlide(pageNum,pageNumBefore,'p');
            console.log('下滑 从',pageNum,'页面到',pageNumBefore,'页面');
        }
    },
    swipeLeft: function(event, direction, distance, duration, fingerCount) {
        console.log('左滑');
    },
    swipeRight: function(event, direction, distance, duration, fingerCount) {
        console.log('右滑');
    }
});

function topSlide(cpnum, npnum, names) { //当前页，下一页，需要移动的div的类
    $('.' + names + npnum).fadeIn(1, function() {
        $('.' + names + npnum).css({
            "-webkit-transition": "0s -webkit-transform",
            "transition": "0s transform",
            "-webkit-transform": "translate3d(0%, -100%, 0)",
            "transform": "translate3d(0%, -100%, 0)",
        }).fadeIn(1, function() {
            $('.' + names + cpnum).css({
                "-webkit-transition": "0.5s -webkit-transform",
                "transition": "0.5s transform",
                "-webkit-transform": "translate3d(0%, 100%, 0)",
                "transform": "translate3d(0%, 100%, 0)",
            });
            $('.' + names + npnum).css({
                "-webkit-transition": "0.5s -webkit-transform",
                "transition": "0.5s transform",
                "-webkit-transform": "translate3d(0%, 0%, 0)",
                "transform": "translate3d(0%, 0%, 0)",
            }).fadeIn(1, function() {
                $('.' + names + cpnum).delay(500).fadeOut(1, function() {
                    res = true;
                    pageNum = pageNum - 1;
                    if (pageNum == 0) {
                        pageNum = 3;
                    }
                });
            });
        });
    });
}
function bottomSlide(cpnum, npnum, names) { //当前页，上一页，需要移动的div的类
    $('.' + names + npnum).fadeIn(1, function() {
        $('.' + names + npnum).css({
            "-webkit-transition": "0s -webkit-transform",
            "transition": "0s transform",
            "-webkit-transform": "translate3d(0%, 100%, 0)",
            "transform": "translate3d(0%, 100%, 0)",
        }).fadeIn(1, function() {
            $('.' + names + cpnum).css({
                "-webkit-transition": "0.5s -webkit-transform",
                "transition": "0.5s transform",
                "-webkit-transform": "translate3d(0%, -100%, 0)",
                "transform": "translate3d(0%, -100%, 0)",
            });
            $('.' + names + npnum).css({
                "-webkit-transition": "0.5s -webkit-transform",
                "transition": "0.5s transform",
                "-webkit-transform": "translate3d(0%, 0%, 0)",
                "transform": "translate3d(0%, 0%, 0)",
            }).fadeIn(1, function() {
                $('.' + names + cpnum).delay(500).fadeOut(1, function() {
                    res = true;
                    pageNum = pageNum + 1;
                    if (pageNum == 4) {
                        pageNum = 1;
                    }
                });
            });
        });
    });
}