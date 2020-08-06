$(document).ready(function () {
    $("#submitComment").click(function () {
        $.ajax({
            type: "POST",
            url: "/api/comment",
            data: {
                whoIs: $("#recipient-name").val(),
                text: $("#message-text").val(),
                articleID: $(this).attr("article-id")
            },
            success: function (response) {
                alert(response);
                location.reload();
            },
            error: function (err) {
                alert(err.responseText);
            }
        });
    })
});