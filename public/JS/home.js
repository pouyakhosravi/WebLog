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

    // enter key for login
    $(document).bind('keypress', function(e) {
        if(e.keyCode==13){
            $('.login-button').trigger('click');
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
            $(".goUp").css("display","block");
        }
        if( $(this).scrollTop() === 0 )
        {
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