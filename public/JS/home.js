let letSendRequest;

$(document).ready(function () {

    // go to sing up page 
    $(".singUp-button").click(function () {
        $.ajax({
            type: "GET",
            url: "api/singUp",
            success: function (singUp) {
                window.location.href = window.location.origin + "/api/singUp";
            }
        });
    });

    // change type pass input for show password or hide this
    let shoPass = false;
    $("#passLoginIcon").click(function () {
        if(shoPass === false)
        {
            shoPass = true;
            $(this).removeClass("fas fa-eye").addClass("fas fa-eye-slash");
            $("#password").attr("type", "text");
        }
        else
        {
            shoPass = false;
            $(this).removeClass("fas fa-eye-slash").addClass("fas fa-eye");
            $("#password").attr("type", "password");
        }
    });

    let selector;

    // enter key for login or chat
    $(document).bind('keypress', function(e) {
        if(e.keyCode==13){
            if( $(".inputText").is(":focus") && !e.shiftKey)
            {
                if( $('#goToChat').css('display') === "block")
                {
                    if($(".inputText").val() !== "")
                    {
                        e.preventDefault();
                        $('#goToChat').trigger('click');
                    }
                    else
                    {
                        e.preventDefault();
                        alert("برای ورود به چت ابتدا باید نام خود را وارد کنید.");
                    }
                }
                else
                {
                    if($(".inputText").val() !== "")
                    {
                        e.preventDefault();
                        $('#send-note').trigger('click');
                    }
                    else
                    {
                        e.preventDefault();
                        alert("شما هیچ پیامی وارد نکردید");
                    }
                }
            }
            else if( $("#userName").is(":focus") || $("#password").is(":focus") )
            {
                $('.login-button').trigger('click');
            }
        }
    });

    // login to dashboard
    $(".login-button").click(function () {
        letSendRequest = true;

        selector = document.getElementsByClassName("loginInputs");
        for(let i = 0; i < selector.length; i++)
        {
            if(selector[i].value === "")
            {
                letSendRequest = false;

                selector[i].style.borderBottom = "solid 3px red";
                selector[i].placeholder = "الزامی*";
                selector[i].classList.add("changeColor");
            }
        }

        if(letSendRequest === true)
        {
            // send req for go to dashboard
            $.ajax({
                type: "POST",
                url: "/api/logIn",
                data: {userName: selector[0].value.trim(), password: selector[1].value.trim()},
                success: function (loginResponse) {    
                    window.location.href = window.location.origin + "/api/user/dashboard";
                },
                error: function (errOfLogin) {
                    $(".loginBox h3").html(errOfLogin.responseText);
                    $(".loginBox h3").css("color", "red");
                }
            });
        }
    });

    let showCounter = false;
    // show go up page button and counters
    $(window).scroll(function () {
        if( $(this).scrollTop() > 100 )
        {
            $(".chatPanel").css("right", "60px");
            $(".goUp").css("display","block");
        }
        if( $(this).scrollTop() < 100 )
        {
            $(".chatPanel").css("right", "15px");
            $(".goUp").css("display","none");
        }
        if( $(this).scrollTop() > 200 )
        {
            if(showCounter === false)
            {
                showCounter = true;
                $(".articleCount .circleContent").animate({left: "0px"}, "slow");
                $(".visitCount .circleContent").animate({top: "30px"}, "slow");
                $(".authorCount .circleContent").animate({right: "0px"}, "slow");
            }
        }
    });

    // go up page
    $(".goUp span").click(function () {
        $("html, body").animate({ scrollTop: 0 }, "slow");
    });

    // get all articles
    $("#seeAllArticle").click(function () {
        $.ajax({
            type: "GET",
            url: "/api/article/all",
            success: function (allArticle) {
                window.location.href = window.location.origin + "/api/article/all";
            },
            error: function (err) {
                alert(err.responseText);
            }
        });
    });

    // get all authors
    $("#seeAllAouthor").click(function () {
        $.ajax({
            type: "GET",
            url: "/api/user/getAll",
            success: function (response) {
                window.location.href = window.location.origin + "/api/user/getAll";
            },
            error: function (err) {
                alert(err.responseText);
            }
        });
    });

    // send to admin message
    $("#adminMessage").click(function () {
        $.ajax({
            type: "POST",
            url: "/api/adminMessage",
            data: {
                name: $("#fName").val(),
                family: $("#lName").val(),
                mail: $("#call-mail").val(),
                title: $("#subject").val(),
                text: $("#context").val()
            },
            success: function (message) {
                alert(message)
                location.reload();
            },
            error: function (err) {
                alert(err.responseText);
            }
        });
    });

    // show input name for chat
    $(".showChat-button").click(() => {
        $(".showChat-button").css("display", "none");
        $(".chatPanel").css({"border":"solid 1px black", "width":"350px", "transition-duration":"0.4s"});
        $(".chatPanel-footer").css({"backgroundColor":"teal"});

        $(".inputText").css("display", "block");
        $("#goToChat").css("display", "block");
    });

    let clientSocket;
    let name;
    // got to chat
    $("#goToChat").click(() => {
        if( $(".inputText").val() !== "" )
        {
            if( $(".inputText").val().length > 40 )
            {
                alert("طول نام شما بیشتر از حد مجاز میباشد");
            }
            else
            {
                name = $(".inputText").val();

                // create socket io in front side
                clientSocket = io();
                
                // get name and send to server socket for login to chat
                clientSocket.emit("login", {name});

                // send to all user login new user news
                clientSocket.on("newUser", (data) => {
                    $(".chatPanel-body").append(`<p>${data}</p>`);
                });

                // success login result for same user
                clientSocket.on("successLogin", (data) => {
                    $(".chatPanel-body").append(`<p>${data}</p>`);
                });

                // add to list
                clientSocket.on("addToOnlineList", (data) => {
                    $(".dropdown-menu").text("");
                    for(let i = 0; i < data.length; i++)
                    {
                        $(".dropdown-menu").append(`<a>${data[i]}</a>`);
                    }
                });

                // remove from lids
                clientSocket.on("removeFromOnlineList", (data) => {
                    $(".dropdown-menu").text("");
                    for(let i = 0; i < data.length; i++)
                    {
                        $(".dropdown-menu").append(`<a>${data[i]}</a>`);
                    }
                });
                
                // send logout news this user for all
                clientSocket.on("oldUser", (data) => {
                    $(".chatPanel-body").append(`<p>${data}</p>`);
                });

                // get new message for another user
                clientSocket.on("newMessage", (data) => {
                    console.log(data);
                    $(".chatPanel-body").append(`<div class="anotherMessageParent"> <div class="anotherText"> <div class="anotherNeshane"></div> <div class="anotherName">${data.name}</div>  <div class="anotherText">${data.myMessage}</div> </div> </div>`);
                });

                $(".inputText").val("");
                $(".inputText").attr("placeholder", "پیام خود را وارد کنید:");
    
                $("#goToChat").css("display", "none");
                $("#send-note").css("display", "block");
        
                $(".chatPanel-footer").css({"height":"55px", "transition-duration":"0.4s"});
                $(".chatPanel-footer button").css({"height":"40px"});
                $(".inputText").css({"height":"50px", "transition-duration":"0.4s"});
        
                $(".chatPanel-body").css({"height":"230px", "transition-duration":"0.4s"});
                $(".chatPanel-header").css({"height":"30px", "transition-duration":"0.4s"});
        
                $(".closeChat").css("display", "block");
                $(".dropdown").css("display", "block");
            }
        }
        else
        {
            alert("برای ورود به چت ابتدا باید نام خود را وارد کنید.");
        }

    });


    // close chat
    $(".closeChat").click(() => {

        // send name for logout
        clientSocket.emit("logOut", {name});

        // send to all user loge out this user
        clientSocket.on("successLogOut", (userName) => {
            console.log(userName);
        });

        $(".closeChat").css("display", "none");
        $(".dropdown").css("display", "none");

        $(".chatPanel-footer").css({"height":"40px", "transition-duration":"0.4s"});

        $(".inputText").attr("placeholder", "نام خود را وارد کنید");
        $(".inputText").val("");
        $(".inputText").css({"height":"30px", "transition-duration":"0.4s"});

        $(".chatPanel-footer button").css({"height":"30px"});

        $("#goToChat").css("display", "block");
        $("#send-note").css("display", "none");

        $(".chatPanel-body").css({"height":"0px", "transition-duration":"0.4s"});
        $(".chatPanel-header").css({"height":"0px", "transition-duration":"0.4s"});

        setTimeout(() => {
            $(".chatPanel").css({"border":"", "width":"42px", "transition-duration":"0.4s"});
            $(".chatPanel-footer").css({"backgroundColor":""});
            $(".showChat-button").css("display", "flex");
            $("#goToChat").css("display", "none");
            $(".inputText").css({"display":"none"});
            $(".chatPanel-body").html("");
        },400);
    });

    let myMessage;
    // send message to chat room
    $("#send-note").click(function () {
        if($(".inputText").val() !== "")
        {
            myMessage = $(".inputText").val();
            $(".inputText").val("");

            // get message and sent to all user with your name
            clientSocket.emit("message", {myMessage, name});
            // append my text to chat body
            $(".chatPanel-body").append(`<div class="myMessageParent"> <div class="myText"> <div class="neshane"></div> <div class="youName">${name}</div>  <div class="youText">${myMessage}</div> </div> </div>`);

        }
        else
        {
            alert("شما هنوز هیچ پیامی وارد نکردید.");
        }
    });

});

function reset(loginInput) {
    if(loginInput.style)
    {
        loginInput.style.borderBottom = "none";
        if(loginInput.id === "userName")
        {
            loginInput.placeholder = "نام کاربری";
        }
        else
        {
            loginInput.placeholder = "رمز عبور";
        }
        loginInput.classList.remove("changeColor");
    }
}