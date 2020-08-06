$(document).ready(function () {
    
    // edite article
    $(".edit").click(function () {

        $(".edit, .title, .return").css("display", "none");
        $(".editTitle").attr("placeholder", `${$(".title").text()}`);
        $("#ok, #no, .editTitle").css("display", "block");

        $("#ok").click(function () {

            let title;
            if($(".editTitle").val() !== "")
            {
                title = $(".editTitle").val();
            }
            else
            {
                title = $(".title").text();
            }

            // update my article
            $.ajax({
                type: "PUT",
                url: "/api/article",
                data: {
                    title: title,
                    text: $(".text").summernote("code"),
                    articleID: $("#ok").attr("article-id")
                },
                success: function (response) {
                    alert(response);
                    window.location.href = window.location.origin + "/api/user/dashboard";
                },
                error: function (err) {
                    alert(err.responseText);
                }
            });
        });

        $("#no").click(function() {
            location.reload();
        });

        $('.text').summernote({
            focus: true,
            height: 350,
            width: "100%"
        });
    });

});