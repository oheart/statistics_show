$(document).ready(function () {

    var fullViewPicData;
    function showImagesWithId(workId){
        var url = 'http://123.57.3.33:9000/api/work/id/' + workId;
        $.get(url, function(data){
            if (data.code!=0){
                console.log("code="+data.code);
                alert("作品不存在");
            } else {
                var jsonData = data.data;
                processJsonData(jsonData);
            }
        });
    }

    function isEmpty(obj){
        for(var name in obj)
        {
            if(obj.hasOwnProperty(name))
            {
                return false;
            }
        }
        return true;
    }

    function processJsonData(jsonData){
        if (jsonData.title!=null) {
            $(".goods_name").text(jsonData.title);
        }
        if (jsonData.desc!=null) {
            $(".goods_item_desc").text(jsonData.desc);
        }
        if (jsonData.price!=null) {
            $(".goods_buy_left_1").text("即刻限时特价：￥"+jsonData.price);
        }
        if (jsonData.saleCount!=null) {
            $(".goods_buy_left_2").text("销量: "+jsonData.saleCount);
        }
        if (jsonData.likeCount!=null) {
            $(".item_like").text(jsonData.likeCount);
        }
        if (jsonData.collectCount!=null){

        }
        if (jsonData.lookCount!=null){

        }
        if (jsonData.userName!=null){
            $(".user_name").text(jsonData.userName);
        }
        //pic list
        if (jsonData.picUrls!=null){
            var imgArray = new Array();
            for (var i=0; i<jsonData.picUrls.length; i++) {
                //imgArray.push('http://123.57.3.33:9000/pic/work/'+jsonData.picUrls[i]);
                imgArray.push(jsonData.picUrls[i]);
            }
            var descList = new Array();
            //旋转图片跟随简介
            if (!isEmpty(jsonData.picTags)){
                if(jsonData.picTags.length==0){
                    $(".img_desc").hide();
                }else{
                    $(".img_desc").show();
                    var index=new Array;
                    for(key in jsonData.picTags){
                        index[index.length]=key;
                    }
                    if(index.length==1){
                        descList.push(jsonData.picTags[index[0]]);
                    }else{
                        for(var i=1;i<index.length;i++){
                            for(var j=0;j<parseInt(index[i]-index[i-1]);j++){
                                descList.push(jsonData.picTags[index[i-1]]);
                            }
                        }
                        if(index[index.length-1]<50){
                            for(var i=0;i<=50-(index[index.length-1]);i++){
                                descList.push(jsonData.picTags[index[index.length-1]]);
                            }
                        }
                    }
                    //console.log(descList);
                    /*var copies=Math.floor(imgArray.length/jsonData.picTags.length);
                     for(var i=0;i<jsonData.picTags.length;i++){
                     for(var j=0;j<copies;j++){
                     descList.push(jsonData.picTags[i]);
                     }
                     }*/
                }

            }

            var totalPicNum = imgArray.length;
            var picHeight = "100%";
            var picWidth = "100%";
            var product_1 = $('.product1').ThreeSixty({
                totalFrames: totalPicNum, // Total no. of image you have for 360 slider
                endFrame: totalPicNum, // end frame for the auto spin animation
                currentFrame: 0, // This the start frame for auto spin
                zeroBased: true,
                imgList: '.threesixty_images', // selector for image list
                progress: '.spinner', // selector to show the loading progress
                filePrefix: '', // file prefix if any
                ext: '.jpg', // extention for the assets
                height: picHeight,
                width: picWidth,
                navigation: true,
                disableSpin: false, // Default false
                imgDescList: descList,
                imgDesc: '.img_desc',
                framerate: 30,
                imgArray: imgArray
            });
        }
        if (jsonData.link!=null){
            $(".goods_buy_btn").click(function(){
                window.location.href = jsonData.link;
            });
        }
    }


    function showImagesFromLocalJson(jsonFile){
        $.getJSON(jsonFile, function(data){
            if (data.code!=0) {
                console.log("code: "+data.code);
                alert("作品不存在");
            } else {
                processJsonData(data.data);
                fullViewPicData = data.data;
            }
        });
    }

    showImagesFromLocalJson('data/example.json');


    //全屏滚动
    $('#statistic-show-container').fullpage(
        {
            scrollOverflow: true,
           /* afterRender: function (anchorLink, index) {
                console.log(index);
            },*/
            /*onLeave: function(index, nextIndex, direction){
                console.log(index);
                console.log(nextIndex);
                if(index == 1){
                    $('.swx-barrage').show();
                    $('.swx-hot-spots').show();
                }else{
                    $('.swx-barrage').hide();
                    $('.swx-hot-spots').hide();
                }
            }*/
        }
    )




    //初始化时播放音乐
    var myAuto = document.getElementById('audio');
    myAuto.play();

    //点击切换音乐播放和暂停效果
    $('.swx-music').click(function(){
        if(myAuto.paused){
            $('.swx-music').attr('src','/statistics_show/img/music.png');
            $('.swx-music').removeClass('music-pause');
            myAuto.play();
        }else{
            $('.swx-music').attr('src','/statistics_show/img/music_pause.png');
            $('.swx-music').addClass('music-pause');
            myAuto.pause();
        }

    });
    var firstSeeHtml = '  <div class="pinch-zoom">' +
        '<div class="img full-view-pic-box">'  +
        '<!-- <span class="yuantu">退底图</span> -->' +
        '<div class="threesixty product1">'  +
        '<div class="spinner">' +
        '<span>0%</span>' +
        '</div>' +
        '<ol class="threesixty_images"></ol>' +
        '</div>' +
        '</div>' +
        '</div>';
    $('.first-see-pic-box').append(firstSeeHtml);
    //点击热点
    var ifOpenHotFlag = false;
    $('.swx-hot-spots').click(function(){
        ifOpenHotFlag = !ifOpenHotFlag;
        if(ifOpenHotFlag){
            $('.first-see-pic-box').empty();
            $('.first-see-pics-desc').hide();
            $('.full-view-pic-box').hide();
            $('.swx-hot-area').show();
            $('.swx-hot-spots').attr('src','/statistics_show/img/hot_on.png');
            console.log('热带');
            for (var i=0; i< fullViewPicData.picUrls.length; i++) {
                var html = '<div class="swiper-slide">' +
                    '<img src="'+ fullViewPicData.picUrls[i] +'" class="active-hot-pics"/>' +
                        '<div class="fullview-pic-desc">'+ (fullViewPicData.picTags[i] || '无') +'</div>'
                    '</div>';
                if(i <= 3){
                    $('.swiper-wrapper').append(html);
                }
            }
            var swiper = new Swiper('.swiper-container',{
                autoplay : 2000,
                autoplayDisableOnInteraction : false,
            });
        }else{
            showImagesFromLocalJson('data/example.json');
            $('.first-see-pic-box').append(firstSeeHtml);
            $('.first-see-pics-desc').show();
            $('.full-view-pic-box').show();
            $('.swx-hot-area').hide();
            $('.swx-hot-spots').attr('src','/statistics_show/img/hot_off.png');
        }
    });
});
