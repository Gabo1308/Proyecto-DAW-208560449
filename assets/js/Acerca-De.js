$(".nav-link").hover(
        function () {
            $(this).stop().animate({
                marginTop: "-5px"
            }, 200).css("color","#ff4da6");
        },
        function () {
            $(this).stop().animate({
                marginTop: "0px"
            }, 200).css("color","grey");;
        }
    );