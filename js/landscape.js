(function() {

    var $landscapeTip;
    function showLandscapeTip() {
        if (!$landscapeTip) {
            var html = '<div class="landscape-tip" style="background: black; color: white; font-size: 1em; text-align: center; position: fixed; width: 100%; height:100%;right:0; top: 0; left: 0; bottom: 0; z-index: 10000; overflow: hidden;">' +
                '<div class="content" style="height: 45%"></div>' +
                '<div class="content style="text-align: center">请竖屏浏览</div>' +
                '</div>';
            $landscapeTip = $(html);
            $(document.body).append($landscapeTip);
            $('.landscape-tip').on('touchstart',function(){
                return false;
            })
        }
        $landscapeTip.show();
    }

    function hideLandscpeTip() {
        if ($landscapeTip) {
            $landscapeTip.hide();
        }
    }

    function updateOrientation() {
        var orientation = window.orientation;
        switch(orientation){
            case 90:
            case -90:
                orientation="landscape";
                showLandscapeTip();
                break;
            default:
                orientation="portrait";
                hideLandscpeTip();
                break;
        }
    };

    function initOrientationChange() {
        window.addEventListener("orientationchange", updateOrientation, false);
        updateOrientation();
        // showLandscapeTip();   // debug
    }
    initOrientationChange();

})();
