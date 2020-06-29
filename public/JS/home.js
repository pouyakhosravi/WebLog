$(document).ready(function () {
    // go to sing up page 
    $(".singUp-button").click(function () {
        $.ajax({
            type: "GET",
            url: "/api/singUp",
            success: function (singUp) {
                window.location.href = window.location.origin + "/api/singUp";
            }
        });
    });
});