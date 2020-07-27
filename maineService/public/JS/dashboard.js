$(document).ready(function () {
    //call get date and clock mathod
    setInterval(setTime, 1000);

    // set time under on caret down
    $("#caretIcon i").click(function () {
        if($(".dialog2").css("display") === "none")
        {
            $(this).css({"transform":`rotate(${180}deg)`, "transition-duration":"0.5s"});
            $(".dialog2").slideDown(400);
            setTimeout(function () {
                $(".dialog2-name").css({"left":"0px", "transition-duration":"0.5s"});
                $(".dialog2-time").css({"right":"0px", "transition-duration":"0.5s"});
            }, 400);
        }
        else
        {
            $(this).css({"transform":`rotate(${0}deg)`, "transition-duration":"0.5s"})
            $(".dialog2-name").css({"left":"100%", "transition-duration":"0.5s"});
            $(".dialog2-time").css({"right":"100%", "transition-duration":"0.5s"});
            setTimeout(function () {
                $(".dialog2").slideUp(400);
            }, 400);
        }
    });

    // hidden dialog 2 if is it show up 95 px
    $(window).resize(function () {
        if($(this).width() > 950)
        {
            if($(".dialog2").height() !== 0)
            {
                $("#caretIcon i").css({"transform":`rotate(${0}deg)`});
                $(".dialog2").css("display", "none");
            }
        }
    });

    // show search bar
    $("#searchArticle").click(function () {
        $("#closeSearch").animate({deg:90}, {duration:"0.5", step: function (now) {
            $(this).css({ transform: 'rotate(' + now + 'deg)' });
        }});

        $(".searchPanel").css({"width": `${$(window).width() - 100}`, "height":`${$(window).height() - 100}`, "display":"flex"}).hide().fadeIn();
        setTimeout(function () {
            $(".search-line").css({"width":"80%", "transition-duration":"0.3s"});
        }, 300);
    });

    // rotate close search panel icon
    $("#closeSearch").click(function () {
        $("#closeSearch").animate({deg:0}, {duration:"0.5", step: function (now) {
            $(this).css({ transform: 'rotate(' + now + 'deg)' });
        }});
    })

    // hide searchbar
    $("#closeSearch").click(function () {
        $(".search-line").css({"width":"10%", "transition-duration":"0.3s"});
        $(".searchPanel").fadeOut();

    });

    //open burger menu in dashboard and close (set animation)
    $("#burgerIcon").click(function () {
        if($("#line2").css("opacity") !== "0")
        {
            $(".sideBar").css({"width":"200px", "transition-duration":"0.5s", "border-left":"solid 2px black"})
            
            setTimeout(function () {
                $(".linksParent2 #link1").css({"right":"0px", "transition-duration":"0.5s"});
                $(".linksParent2 #link2").css({"right":"0px", "transition-duration":"0.7s"});
                $(".linksParent2 #link3").css({"right":"0px", "transition-duration":"0.9s"});
                $(".linksParent2 #link4").css({"right":"0px", "transition-duration":"1.1s"});
                $(".linksParent2 #link5").css({"right":"0px", "transition-duration":"1.3s"});
                $(".linksParent2 #link6").css({"right":"0px", "transition-duration":"1.5s"});
            },500);

            $("#line1").css({"-webkit-transform":"rotate(-45deg) translate(-7px,5px)", "transition-duration":"0.5s"});
            $("#line2").css({"opacity":"0", "transition-duration":"0.5s"});
            $("#line3").css({"-webkit-transform":"rotate(45deg) translate(-7px,-4px)", "transition-duration":"0.5s"});    
        }
        else
        {
            $(".linksParent2 #link1").css({"right":"100%", "transition-duration":"0.5s"});
            $(".linksParent2 #link2").css({"right":"100%", "transition-duration":"0.7s"});
            $(".linksParent2 #link3").css({"right":"100%", "transition-duration":"0.9s"});
            $(".linksParent2 #link4").css({"right":"100%", "transition-duration":"1.1s"});
            $(".linksParent2 #link5").css({"right":"100%", "transition-duration":"1.3s"});
            $(".linksParent2 #link6").css({"right":"100%", "transition-duration":"1.5s"});

            setTimeout(function () {
                $(".sideBar").css({"width":"0px", "border-left":"none", "transition-duration":"0.5s"})
            },500);

            $("#line1").css({"-webkit-transform":"rotate(0deg) translate(0px,0px)", "transition-duration":"0.5s"});
            $("#line2").css({"opacity":"1", "transition-duration":"0.5s"});
            $("#line3").css({"-webkit-transform":"rotate(0deg) translate(0px,0px)", "transition-duration":"0.5s"});
        }
    });

    let isAddAvatarClicked = false;
    // select Avatar
    $("#addAvatar").click(function () {
        isAddAvatarClicked = true;

        $("#seeProfile").css({"top":"100%", "transition-duration":"0.5s"});
        $("#addAvatar").css({"bottom":"50px", "transition-duration":"0.5s"});

        $("#submitAvatar").animate({top:"75%", right:"65%"}, "slow");
        $("#cancelAvatar").animate({top:"75%", left:"65%"}, "slow");
    });

    $("#cancelAvatar").click(function () {
        isAddAvatarClicked = false;

        if($(".yourAvatar").mouseenter())
        {
            $("#seeProfile").css({"top":"10px", "transition-duration":"0.5s"});
            $("#addAvatar").css({"bottom":"10px", "transition-duration":"0.5s"});

            $("#submitAvatar").animate({top:"100%", right:"100%"}, "slow");
            $("#cancelAvatar").animate({top:"100%", left:"100%"}, "slow");
        }
        else
        {
            $("#seeProfile").css({"top":"100%", "transition-duration":"0.5s"});
            $("#addAvatar").css({"bottom":"100%", "transition-duration":"0.5s"});
        }
    })

    // show nested your avatar button
    $(".yourAvatar").mouseenter(function () {
        if(isAddAvatarClicked === false)
        {
            $(".yourAvatar img").css({"filter":"blur(3px)", "transition-duration":"0.5s"});
            $("#seeProfile").css({"top":"10px", "transition-duration":"0.5s"});
            $("#addAvatar").css({"bottom":"10px", "transition-duration":"0.5s"});
        }
    });

    //hide neasted your avatar button
    $(".yourAvatar").mouseleave(function () {
        if(isAddAvatarClicked === false)
        {
            $(".yourAvatar img").css({"filter":"blur(0px)", "transition-duration":"0.5s"});
            $("#seeProfile").css({"top":"100%", "transition-duration":"0.5s"});
            $("#addAvatar").css({"bottom":"100%", "transition-duration":"0.5s"});
        }
    });

    // show and hide ok or cancele avatar side bar
    $("#addAvatar2").click(function () {
        $("#submitAvatar2, #cancelAvatar2").css("display","flex");
    });

    // hide ok or cancele avatar side bar
    $("#cancelAvatar2").click(function () {
        $("#submitAvatar2, #cancelAvatar2").css("display","none");
    });

    //submitAvatar1 or 2
    $("#submitAvatar, #submitAvatar2").click(function () {
        $("#submitAvatar2, #cancelAvatar2").css("display","none");

        $('#cancelAvatar').trigger("click");

        // get data and send to db
        let myFile = $('#chooseFile')[0].files[0];
        const fd = new FormData();
        fd.append("avatar", myFile);
        $.ajax({
            type: "PUT",
            url: "/api/user/uploadAvatar",
            data: fd,
            contentType: false,
            processData: false,
            success: function (response) {
                window.location.href = window.location.origin + "/api/user/dashboard";
            },
            error: function (err) {
                console.log("err: " + err.message);
            }
        });
    });

    // hide side bar if this is show
    $(window).resize(function () {
        if( $(this).width() > 950 )
        {
            if( $(".sideBar").width() !== 0)
            {
                $(".sideBar").css({"display":"none", "width":"0px", "border-left":"none"})

                $(".linksParent2 #link1").css("right", "100%");
                $(".linksParent2 #link2").css("right", "100%");
                $(".linksParent2 #link3").css("right", "100%");
                $(".linksParent2 #link4").css("right", "100%");

                $("#line1").css({"-webkit-transform":"rotate(0deg) translate(0px,0px)"});
                $("#line2").css("opacity","1");
                $("#line3").css({"-webkit-transform":"rotate(0deg) translate(0px,0px)"});
            }
        }
    });

    let theme = true;
    // change theme
    $(".changeButton").click(function () {
        if(theme === true)
        {
            theme = false;
            $(".change-theme").css("border-color", "white");
            $(".changeButton").css({"transition-duration":"0.5s", "left":"25px", "color":"white"});
            $(".changeButton i").removeClass("fas fa-sun").addClass("fas fa-moon");
            $("body").css("backgroundColor", "black");
        }
        else
        {
            theme = true;
            $(".change-theme").css("border-color", "black");
            $(".changeButton").css({"transition-duration":"0.5s", "left":"0px", "color":"yellow"});
            $(".changeButton i").removeClass("fas fa-moon").addClass("fas fa-sun");
            $("body").css("backgroundColor", "white");
        }
    });
});

// show time in dashboard
function setTime() {
    $(".dateTxt").html(new Date().toLocaleDateString("fa-IR"));
    $(".clockTxt").html(new Date().toLocaleTimeString("fa-IR"));
}