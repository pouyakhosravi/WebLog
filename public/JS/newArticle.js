$(document).ready(function () {

    $("#submitArticle").click(function () {

        let myTitle = $("#description").val();
        let myContent = $('#summernote').summernote('code');
        // send text editor content to save in db
        $.ajax({
            type: "POST",
            url: "/api/article",
            data: {
                title: myTitle,
                content: myContent
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

});