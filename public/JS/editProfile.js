$(document).ready(function () {

    // show new password parent
    $("#changePass").click( () => {
        $(".changePassParent").css("display", "flex");

        // send last password to confirm 
        $("#updatePass").click(() => {
            if($("#last-pass").val() !== "" && $("#new-pass").val())
            {
                $.ajax({
                    type: "PUT",
                    url: "/api/user/updatePassword",
                    data: {
                        lastPassword: $("#last-pass").val(),
                        newPassword: $("#new-pass").val()
                    },
                    success: function (updatePass) {
                        alert(updatePass)
                        window.location.href = window.location.origin + "/api/user/dashboard";
                    },
                    error: function (err) {
                        alert(err.responseText);
                    }
                });
            }
            else
            {
                alert("فیلد های خالی را پرکنید");
            }
        })

    } );
});

let selector;
function updater() {
    let isGenderOk = true;
    let allFieldEmpty = true;

    //check empty field
    selector = document.getElementsByTagName("input");
    for(let i = 0; i < selector.length && allFieldEmpty === true; i++)
    {
        if(selector[i].value !== "")
        {
            allFieldEmpty = false;
        }
    }

    if(allFieldEmpty === true)
    {
        alert("شما هیچ تغییری انجام نداده اید");
    }

    // check gender
    if(selector[3].value !== "")
    {
        if(selector[3].value.trim() !== "خانم" && selector[3].value.trim() !== "اقا")
        {
            alert("جنست فقط باید (اقا) یا (خانم) باشد");
            isGenderOk = false;
        }
    }

    let FName, LName, UName, sex, phone, country, mail;
    if(isGenderOk === true && allFieldEmpty === false)
    {
        FName = setter("F-name", FName);
        LName = setter("L-name", LName);
        UName = setter("U-name", UName);
        sex = setter("sex", sex);
        phone = setter("phone", phone);
        country = setter("country", country);
        mail = setter("mail", mail);

        $.ajax({
            type: "PUT",
            url: "/api/user/updatePro",
            data: {
                firstName: FName,
                lastName: LName,
                userName: UName,
                sex: sex,
                mobile: phone,
                country: country,
                mail: mail
            },
            success: function (updatePro) {
                alert(updatePro);
                window.location.href = window.location.origin + "/api/user/dashboard";
            },
            error: function (err) {
                alert(err.responseText);
            }
        });
    }
};

function setter(ID, variable) {

    if(document.getElementById(`${ID}`).value !== "")
    {
        variable = document.getElementById(`${ID}`).value.trim();
    }
    else
    {
        variable = document.getElementById(`${ID}`).placeholder.trim();
    }
    
    return variable;
};