var countriesInformation;
let letSendRequest;
$(document).ready(function () {

    //get countries information
    $.ajax({
        type: "GET",
        url: "https://restcountries.eu/rest/v2",
        success: function (countriesResponse) {
            countriesInformation = countriesResponse
            //setCountries in drop menu
            $("#countryMenu").html("");
            for(let i = 1; i < countriesResponse.length; i++)
            {
                $("#countryMenu").append(`<div onclick="setInfo(this)"> ${countriesResponse[i].translations.fa} </div>`)
            }

            //show page
            $(".loadPanel").css("display","none");
            $("body").css("height","auto")
            $("#page").css({"background-image":`url(../Images/book.jpg)`, "background-size":"contain", "display":"block"});
        }
    });

    // show pass field
    $("#showPass").mousedown(function () {
        $("#password").attr("type","text");
        $("#showPass").removeClass("fas fa-eye").addClass("far fa-eye-slash");
    });
    $("#showPass").mouseup(function () {
        $("#password").attr("type","password");
        $("#showPass").removeClass("far fa-eye-slash").addClass("fas fa-eye");
    });
    //show retry pass field
    $("#showRetryPass").mousedown(function () {
        $("#retryPassword").attr("type","text");
        $("#showRetryPass").removeClass("fas fa-eye").addClass("far fa-eye-slash");
    });
    $("#showRetryPass").mouseup(function () {
        $("#retryPassword").attr("type","password");
        $("#showRetryPass").removeClass("far fa-eye-slash").addClass("fas fa-eye");
    });
    
    let selector;
    // handel sabt event
    $("#sabt").click(function () {

        // show feed back if any wrong
        selector = document.getElementsByClassName("card");
        for(let i = 0; i < selector.length; i++)
        {
            if(selector[i].getElementsByTagName("input")[0].value === "")
            {
                feedBack(i, "الزامی *")
            }
            else if(selector[i].getElementsByTagName("input")[0].id === "userName" || selector[i].getElementsByTagName("input")[0].id === "firstName" || selector[i].getElementsByTagName("input")[0].id === "lastName")
            {
                if(selector[i].getElementsByTagName("input")[0].value.length < 3 || selector[i].getElementsByTagName("input")[0].value.length > 30)
                {
                    feedBack(i, "طول این فیلد باید بین 3 تا 30 کاراکتر باشد.")
                }
            }
            else if(selector[i].getElementsByTagName("input")[0].id === "phoneNumber")
            {
                const NUMBERS = /[^0-9]/g;//if not number err
                if(selector[i].getElementsByTagName("input")[0].value.match(NUMBERS))
                {
                    feedBack(i, "این فیلد فقط باید عددی باشد.")
                }
                else if(selector[i].getElementsByTagName("input")[0].value.charAt(0) === "0")
                {
                    feedBack(i, "شماره موباید خود را بدون صفر وارد کنید")
                }
                else if(selector[i].getElementsByTagName("input")[0].value.trim().length !== 10)
                {
                    feedBack(i, "طول این فیلد باید 10 رقمی باشد.")
                }
            }
            else if(selector[i].getElementsByTagName("input")[0].id === "mail")
            {
                if(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(selector[i].getElementsByTagName("input")[0].value))
                {
                    // there is no any work if email be valid
                }
                else
                {
                    letSendRequest = false;
                    feedBack(i, "ایمیل وارد شده صحیح نمیباشد.")
                }
            }
        }

        // show pass feddBack handle
        if(selector[3].getElementsByTagName("input")[0].value.length > 8 && selector[3].getElementsByTagName("input")[0].value.length < 30 && selector[4].getElementsByTagName("input")[0].value.length > 8 && selector[4].getElementsByTagName("input")[0].value.length < 30)
        {            
            if(selector[3].getElementsByTagName("input")[0].value.trim() != selector[4].getElementsByTagName("input")[0].value.trim())
            {
                feedBack(3, "رمز نادرست میباشد.");
                feedBack(4, "رمز نادرست میباشد.");
            }
        }
        else
        {            
            if(selector[3].getElementsByTagName("input")[0].value.length !== 0 && selector[3].getElementsByTagName("input")[0].value.length < 8 || selector[3].getElementsByTagName("input")[0].value.length > 30)
            {
                feedBack(3, "طول این فیلد باید بین 8 تا 30 کاراکتر باشد");
            }
            if(selector[4].getElementsByTagName("input")[0].value.length !== 0 && selector[4].getElementsByTagName("input")[0].value.length <8 || selector[4].getElementsByTagName("input")[0].value.length > 30)
            {
                feedBack(4, "طول این فیلد باید بین 8 تا 30 کاراکتر باشد");
            }
        }
        
        //create object of inputs and send to server for save in data base
        if(letSendRequest === true)
        {
            let userInfo = new userInformation($("#userName").val().trim(), $("#firstName").val().trim(), $("#lastName").val().trim(), $("#password").val().trim(), $("#retryPassword").val().trim(), $("#countryMenuButton").text().trim(), $('input[name = gender]:checked').val().trim(), $("#phoneNumber").val().trim(), $("#mail").val().trim());
            $.ajax({
                type: "POST",
                url: "/api/singUp",
                data: userInfo,
                success: function (newUser) {
                    serverMsg("ثبت نام شما با موفقیت انجام شد", "green", "rgba(0, 255, 0, 0.376)", "greenyellow");
                    setTimeout(function () {
                        window.location.href = window.location.origin;
                    }, 1500);
                },
                error: function (errNewUser) {
                    serverMsg(errNewUser.responseText, "red", "rgba(255, 0, 0, 0.376)", "red");
                }
            });
        }
    });

    // show alert
    $("#googleButton, #facebookButton").click(function () {
        serverMsg("این قابلیت اکنون در دسترس نمیباشد", "red", "rgba(255, 0, 0, 0.376)", "red");
    });

    $(".myLogo").click(function () {
        $.ajax({
            type: "GET",
            url: "/",
            success: function (homeResponse) {
                window.location.href = window.location.origin;
            }
        });
    });
});

// show server error
function serverMsg(dialog, borderColor, backColor, color) {
    $(".alert").html("");
    $(".alert").html(dialog);
    $(".alert").css({"border":`solid 1px ${borderColor}`, "backgroundColor":`${backColor}`, "color":`${color}`})
    $(".alert").slideDown(500);
    setTimeout(function () {
        $(".alert").slideUp(500);
    },1000);
}

//set cities in drop Down
function setInfo(countryClicked) {
    //set country clicked name ond button
    $("#countryMenuButton").text( $(countryClicked).text() );

    // set flag and pishs homare
    let findInfo = false;
    for(let i = 0; i < countriesInformation.length && findInfo === false; i++)
    {        
        if(countriesInformation[i].translations.fa === $(countryClicked).text().trim())
        {
            $(".pishShomare").html("+" + countriesInformation[i].callingCodes[0]);
        }
    }
};

// check inputs validation and hide feed Back
function checkValidation(card) {
    if(card.getElementsByTagName("input")[0].id === "userName" && card.getElementsByTagName("input")[0].value !== "")
    {
        $.ajax({
            type: "GET",
            url: `/api/user/FindUser/${card.getElementsByTagName("input")[0].value.trim()}`,
            success: function (isDuplicateUserName) {
                if(isDuplicateUserName === true)
                {
                    feedBack(0, "این نام کار بری قبلا ثبت شده است.")
                }
                else if(isDuplicateUserName === false)
                {
                    letSendRequest = true;
                    card.getElementsByClassName("feedBack")[0].innerHTML = "قابل قبول";
                    card.getElementsByClassName("feedBack")[0].style.color = "greenyellow";
                    card.getElementsByTagName("input")[0].style.border = "solid 1px greenyellow"
                }
            },
            error: function (errFindDuplicate) {
                feedBack(0, errFindDuplicate.responseText)
            }
        });
    }

    letSendRequest = true;
    card.getElementsByTagName("input")[0].style.border = "none";
    card.getElementsByClassName("feedBack")[0].innerHTML = "";
    
}

// show feedBack
function feedBack(index, message) {
    letSendRequest = false;

    selector = document.getElementsByClassName("card");

    selector[index].getElementsByClassName("feedBack")[0].innerHTML = message;
    selector[index].getElementsByClassName("feedBack")[0].style.color = "red";
    selector[index].getElementsByTagName("input")[0].style.border = "solid 1px red"
}

//new user object
function userInformation(userName, firstName, lastName, password, retryPassword, country, gender, phone, mail) {
    this.userName = userName,
    this.firstName = firstName,
    this.lastName = lastName,
    this.password = password,
    this.retryPassword = retryPassword,
    this.country = country,
    this.sex = gender,
    this.mobile = phone
    this.mail = mail
}