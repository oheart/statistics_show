$(document).ready(function () {

    var TRANSFORM = 'transform';
    (typeof document.body.style.webkitTransform !== undefined) ? TRANSFORM = 'webkitTransform' :void 0;

    var distance = {}; //用于记住手势距离
    var imgScale = 1;  //用于保存缩放值
    var limitFlag = false;  //是否开启热点
    var curImgIndex = 0; //第二图的显示索引
    var imgArray;
    var descList;
    //从后台获取
    function showImagesWithId(workId){

        var url = 'http://123.57.3.33:9000/api/work/id/' + workId;

        $.get(url, function(data){

            if (data.code!=0){

                console.log("code="+data.code);

            } else {

                var jsonData = data.data;
                processJsonData(jsonData);
            }

        });
    }

    function isEmpty(obj){

        for(var name in obj) {

            if(obj.hasOwnProperty(name)) {

                return false;

            }

        }
        return true;

    }

    function processJsonData(jsonData){

        jsonData.title != null ? $(".goods_name").html(jsonData.title) : void 0;
        jsonData.desc != null ? $(".goods_item_desc").text(jsonData.desc) : void 0;
        jsonData.price != null ? $(".goods_buy_left_1").text("即刻限时特价：￥"+jsonData.price) : void 0;
        jsonData.saleCount != null ? $(".goods_buy_left_2").text("销量: "+jsonData.saleCount) : void 0;
        jsonData.likeCount != null ? $(".item_like").text(jsonData.likeCount) : void 0;
        jsonData.userName != null ? $(".user_name").text(jsonData.userName) : void 0;

        //pic list
        if (jsonData.picUrls!=null){

            if(limitFlag){

                imgArray = [];

                for (var i = 0; i < jsonData.hotPicUrls.length; i++) {

                    //imgArray.push('http://123.57.3.33:9000/pic/work/'+jsonData.picUrls[i]);
                    imgArray.push(jsonData.hotPicUrls[i]);

                }

            }else{

                imgArray = [];

                for (var i = 0; i < jsonData.picUrls.length; i++) {

                    //imgArray.push('http://123.57.3.33:9000/pic/work/'+jsonData.picUrls[i]);
                    imgArray.push(jsonData.picUrls[i]);

                }

            }

            var totalPicNum = imgArray.length;//IMG总张数
            var picHeight = "100%";
            var picWidth = "100%";

            //旋转图片跟随简介
            function imgFollowDisc(data){

                descList = [];

                if(data.length == 0){

                    $(".first-see-pics-desc").hide();

                }else {

                    $(".first-see-pics-desc").show();
                    var index = new Array;

                    for(key in data){

                        index[index.length] = key;

                    }
                    if(index.length == 1){

                        descList.push(data[index[0]]);

                    }else{

                        for(var i = 1;i < index.length;i++){

                            for(var j = 0;j < parseInt(index[i] - index[i - 1]);j++){

                                descList.push(data[index[i - 1]]);

                            }
                        }
                        if(index[index.length - 1] <= totalPicNum){

                            for(var i = 0;i <= totalPicNum -(index[index.length - 1]);i++){

                                descList.push(data[index[index.length - 1]]);

                            }

                        }
                    }
                }

            }

            if(!limitFlag){

                $('.product1').css("display","block");
                $('.product2').css("display","none");

                if (!isEmpty(jsonData.picTags)){

                    imgFollowDisc(jsonData.picTags); //旋转图片跟随简介-非热点

                    $('.img_desc2').css("display","none");
                    $('.img_desc1').css("display","block");

                }

                var product_1 = $('.product1').ThreeSixty({

                    totalFrames: totalPicNum,
                    endFrame: totalPicNum,
                    currentFrame: 0,
                    zeroBased: true,
                    imgList: '.threesixty_images', // selector for image list
                    progress: '.spinner',          // selector to show the loading progress
                    filePrefix: '',                // file prefix if any
                    ext: '.jpg',                   // extention for the assets
                    height: picHeight,
                    width: picWidth,
                    navigation: true,
                    disableSpin: false,            // Default false
                    imgDescList: descList,
                    imgDesc: '.img_desc1',
                    framerate: 500,
                    imgArray: imgArray,
                    autoplayDirection:-1,
                    onReady: function(){
                        product_1.play();
                    },
                    onDragStart: function () {
                        product_1.stop();
                    },
                    onDragStop: function () {
                        product_1.play();
                    }
                });


            }

            if(limitFlag){

                $('.product1').css("display","none");
                $('.product2').css("display","block");
                //旋转图片跟随简介-热点
                if (!isEmpty(jsonData.hotPicTags)){

                    imgFollowDisc(jsonData.hotPicTags); //旋转图片跟随简介-热点
                    $('.img_desc1').css("display","none");
                    $('.img_desc2').css("display","block");

                }
                var imgHtml = "";
                var product2 = document.getElementById("product2");

                for(var i = 0;i < imgArray.length;i++){

                    if(i == 0){

                        imgHtml += "<div class='slideImgDiv zIndex'>";

                    }else{

                        imgHtml += "<div class='slideImgDiv'>";

                    }

                    imgHtml += "<img src="+" ' " + imgArray[i] +" ' curImgIndex=" + i + "> ";
                    imgHtml += "</div>";

                }

                product2.innerHTML = imgHtml;
                $(".img_desc2").text(descList[curImgIndex]);

            }

        }
        if (jsonData.link != null){

            $(".goods_buy_btn").click(function(){

                window.location.href = jsonData.link;

            });

        }

    }
    var fullViewData;
    function showImagesFromLocalJson(jsonFile){

        $.getJSON(jsonFile, function(data){

            if (data.code != 0) {

                console.log("code: "+data.code);

            } else {

                processJsonData(data.data);
                fullViewData = data.data;
            }

        });
    }

    showImagesFromLocalJson('data/example.json');

    //初始化时播放音乐
    var myAuto = document.getElementById('audio');

    //点击切换音乐播放和暂停效果
    $(".swx-music").bind( "click", tapMusicIcon);

    function tapMusicIcon(){

        if(myAuto.paused){

            $('.swx-music').attr('src','/statistics_show/img/music.png');
            $('.swx-music').removeClass('music-pause');

            myAuto.play();

        }else{

            $('.swx-music').attr('src','/statistics_show/img/music_pause.png');
            $('.swx-music').addClass('music-pause');

            myAuto.pause();
        }
    }

    //点击弹幕
    var ifOpenBarrageFlag = false;
    $(".swx-barrage").bind( "click", tapBarrageIcon);

    function tapBarrageIcon(){

        ifOpenBarrageFlag = !ifOpenBarrageFlag;

        if(ifOpenBarrageFlag){

            $('.zpg-barrage-container').show();
            $('.swx-barrage').attr('src','/statistics_show/img/barrage_open.png');

        }else{

            $('.zpg-barrage-container').hide();
            $('.swx-barrage').attr('src','/statistics_show/img/barrage.png');

        }
    }

    //点击热点
    $(".swx-hot-spots").bind( "click", tapHotSpotsIcon);

    function tapHotSpotsIcon(){

        limitFlag = !limitFlag;

        if(limitFlag){

            $('.swx-hot-spots').attr('src','/statistics_show/img/hot_on.png');

        }else{

            $('.swx-hot-spots').attr('src','/statistics_show/img/hot_off.png');

        }

        showImagesFromLocalJson('data/example.json');

    }

    //弹幕
    var barrageBox = $("#J_barrage_stage");
    var barrageArr = [
        {
            "text": "我就是路过看看。。"
        },
        {
            "text": "good"
        },
        {
            "text": "赞赞赞"
        },
        {
            "text": "还想再入一件"
        },
        {
            "text": "强烈推荐，美。。"
        },
        {
            "text": "666"
        },
        {
            "text": "惊呆了"
        },
        {
            "text": "这是啥"
        },
        {
            "text": "摄影棚"
        },
        {
            "text": "360°"
        },
        {
            "text": "喜欢"
        },
        {
            "text": "soga"
        },
        {
            "text": "很满意"
        },
        {
            "text": "☺"
        }
    ];
    for(var i = 0; i < barrageArr.length -1; i++){
        var creSpan = '<div class="mb5 barrage-inner">' +
            '<span class="barrage-txt mr10">'+ barrageArr[i].text +'</span>' +
        '</div>';
        barrageBox.prepend(creSpan);
    }


    function getRandomColor(){
        return '#' + (function(h){
                return new Array(7 - h.length).join("0") + h
            })((Math.random() * 0x1000000 << 0).toString(16));
    }

    //滑动
    var winW = document.documentElement.clientWidth;
    var winH = document.documentElement.clientHeight;
    var oLis = $("li.section");
    [].forEach.call(oLis, function () {
        var oLi = arguments[0];
        oLi.index = arguments[1];
        oLi.addEventListener("touchstart", oLisTouchStart, false);
        oLi.addEventListener("touchmove", oLisTouchMove, false);
        oLi.addEventListener("touchend", oLisTouchEnd, false);
    });

    function getDistance(start, stop) {
        return Math.sqrt(Math.pow((stop.x - start.x), 2) + Math.pow((stop.y - start.y), 2));
    }

    function setScaleAnimation(element,scale) {

        if(scale<0.5){
            scale=0.5
        }
        // 缩放和位移
        element.style[TRANSFORM] = 'scale(' + scale + ')';
    }
    function oLisTouchStart(ev) {

        this.startX = ev.changedTouches[0].pageX;
        this.startY = ev.changedTouches[0].pageY;

        if(ev.target.nodeName == "IMG"){

            if($(ev.target).attr("curImgIndex")){

                curImgIndex = $(ev.target).attr("curImgIndex");

            }

            if (ev.touches.length === 2) {
                distance.start = getDistance({
                    x: ev.touches[0].screenX,
                    y: ev.touches[0].screenY
                }, {
                    x: ev.touches[1].screenX,
                    y: ev.touches[1].screenY
                });
            }

        }
    }
    function oLisTouchMove(ev) {

        ev.preventDefault();
        var touchY = ev.changedTouches[0].pageY;
        var touchX = ev.changedTouches[0].pageX;
        var changeY = touchY - this.startY;
        var changeX = touchX - this.startX;
        var nowIndex = this.index;
        var step = 1 / 5;

        if(ev.target.nodeName!= "IMG"){

            this.flag = true;/*表示滑动而不是点击*/
            //记录下移动的时候的触摸点的坐标
            if(Math.abs(changeX) > Math.abs(changeY)){
                this.flag = false;  //横滑不改变
                return;
            }
            [].forEach.call(oLis,function(){
                //除了自己其他所有的隐藏(通过索引来判断当前这张是不是自己)
                if(nowIndex != arguments[1]){
                    arguments[0].style.display = "none";
                }
                arguments[0].className = "section";
            });
            if (changeY < 0) {//小于0说明是向上移动
                this.nextIndex = nowIndex == oLis.length - 1 ? 0 : nowIndex + 1;
                var duration=winH + changeY;
                if(this.nextIndex==1){
                    oLis[this.nextIndex].style.webkitTransform = "translate(0," + duration + "px)";
                    oLis[this.nextIndex].className = "section zIndex";
                    oLis[this.nextIndex].style.display = "block";
                    this.style.webkitTransform = "scale(" + (1 - Math.abs(changeY / winH)* step ) + ") translate(0," + changeY + "px)";
                }
            } else if((changeY > 0)){
                var duration=-winH + changeY;
                this.nextIndex = nowIndex == 0 ? oLis.length - 1 : nowIndex - 1;
                if(this.nextIndex==0){
                    oLis[this.nextIndex].style.webkitTransform = "translate(0," + duration + "px)";
                    oLis[this.nextIndex].className = "section zIndex";
                    oLis[this.nextIndex].style.display = "block";
                    this.style.webkitTransform = "scale(" + (1 - Math.abs(changeY / winH)* step ) + ") translate(0," + changeY + "px)";
                }
            }
        }else{

            if($(ev.target).attr("curImgIndex")){

                var oDiv = $("div.slideImgDiv");
                curImgIndex = parseInt($(ev.target).attr("curImgIndex"));//当前图的索引

                if(Math.abs(changeX) > Math.abs(changeY)){

                    this.flag = false;  //横滑不改变

                    if(Math.abs(changeX) - Math.abs(changeY) >= 50 && (ev.touches.length < 2)){

                        if(changeX < 0){//小于0说明是向左滑，图片递增
                            curImgIndex = curImgIndex + 1;
                            [].forEach.call(oDiv,function(){
                                //除了自己其他所有的隐藏(通过索引来判断当前这张是不是自己)
                                if(curImgIndex != arguments[1]){
                                    arguments[0].style.display = "none";
                                }
                                arguments[0].className = "slideImgDiv";
                            });
                            if(curImgIndex == imgArray.length){
                                curImgIndex = 0;
                            }
                            var duration=winW + changeX;
                            oDiv[curImgIndex].style.webkitTransform = "translateX(0," + duration + "px)";
                            oDiv[curImgIndex].className = "slideImgDiv zIndex";
                            oDiv[curImgIndex].style.display = "block";
                            this.style.webkitTransform = "scale(" + (1 - Math.abs(changeX / winW)* step ) + ") translateX(0," + changeX + "px)";
                            $(".img_desc2").html(descList[curImgIndex]);

                        }else if(changeX > 0){
                            curImgIndex = curImgIndex - 1;
                            [].forEach.call(oDiv,function(){
                                //除了自己其他所有的隐藏(通过索引来判断当前这张是不是自己)
                                if(curImgIndex != arguments[1]){
                                    arguments[0].style.display = "none";
                                }
                                arguments[0].className = "slideImgDiv";
                            });
                            if(curImgIndex == -1){
                                curImgIndex = 2;
                            }
                            var duration=-winW + changeX;
                            oDiv[curImgIndex].style.webkitTransform = "translateX(0," + duration + "px)";
                            oDiv[curImgIndex].className = "slideImgDiv zIndex";
                            oDiv[curImgIndex].style.display = "block";
                            this.style.webkitTransform = "scale(" + (1 - Math.abs(changeX / winW)* step ) + ") translateX(0," + changeX + "px)";
                            $(".img_desc2").html(descList[curImgIndex]);
                        }
                    }


                }

            }

            if (ev.touches.length === 2) {
                origin = {x: winW/2, y: winW/2}; //缩放中心
                distance.stop = getDistance({
                    x: ev.touches[0].screenX,
                    y: ev.touches[0].screenY
                }, {
                    x: ev.touches[1].screenX,
                    y: ev.touches[1].screenY
                });
                imgScale = distance.stop / distance.start;
                setScaleAnimation(ev.target,imgScale);
            }
        }

    }
    function oLisTouchEnd(ev) {
        if(ev.target.nodeName!= "IMG"){

            if(this.flag){
                //让上一张或者下一张都回到0,0的位置
                oLis[this.nextIndex].style.webkitTransform = "translate(0,0)";
                //oLis[this.nextIndex].style.webkitTransition = "0.1s";
                oLis[this.nextIndex].addEventListener("webkitTransitionEnd",function(){
                    this.style.webkitTransition = "";
                    //增加执行动画的id名
                    //this.firstElementChild.id = "a"+this.index;

                },false);
                this.flag = false;
            }
        }else{
            imgScale = 1;
            setScaleAnimation(ev.target,imgScale);

        }


    }

});
