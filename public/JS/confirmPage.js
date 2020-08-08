// confirm article
function submitArticle(ID) {
    $.ajax({
        type: "PUT",
        url: "/api/article/submit",
        data: {id: ID},
        success: function (submitArticle) {
            alert(submitArticle);
            location.reload();
        },
        error: (err) => {
            alert(err.responseText);
        }
    });
}

// delete article
function deleteArticle(ID) {
    if( confirm("آیا از حذف این مقاله اطمینان دارید؟") )
    {
        $.ajax({
            type: "DELETE",
            url: `/api/article/${ID}`,
            success: function (deleteArticle) {
                alert(deleteArticle);
                location.reload();
            },
            error: (err) => {
                alert(err.responseText);
            }
        });
    }
}

// read Article
function readArticle(ID) {
    $.ajax({
        type: "GET",
        url: `/api/article/readArticle/${ID}`,
        success: function (readPage) {
            window.location.href = window.location.origin + `/api/article/readArticle/${ID}`
        },
        error: (err) => {
            alert(err.responseText);
        }
    });
};

//confirm comments
function submitComment(ID) {
    $.ajax({
        type: "PUT",
        url: "/api/comment/submit",
        data: {id: ID},
        success: function (submitComment) {
            alert(submitComment);
            location.reload();
        },
        error: (err) => {
            alert(err.responseText);
        }
    });
}

// delete article
function deleteComment(ID) {
    if( confirm("آیا از حذف این نظر اطمینان دارید؟") )
    {
        $.ajax({
            type: "DELETE",
            url: `/api/comment/${ID}`,
            success: function (deleteComment) {
                alert(deleteComment);
                location.reload();
            },
            error: (err) => {
                alert(err.responseText);
            }
        });
    }
}

// delete message
function deleteMessage(ID) {
    if( confirm("آیا از حذف این پیام اطمینان دارید؟") )
    {
        $.ajax({
            type: "DELETE",
            url: `/api/message/${ID}`,
            success: function (deleteMessage) {
                alert(deleteMessage);
                location.reload();
            },
            error: (err) => {
                alert(err.responseText);
            }
        });
    }
}

// delete user
function deleteUser(ID) {
    console.log(ID);
    if( confirm("آیا از حذف این کاربر اطمینان دارید؟") )
    {
        $.ajax({
            type: "DELETE",
            url: `/api/user/deleteUser/${ID}`,
            success: function (deleteUser) {
                alert(deleteUser);
                location.reload();
            },
            error: (err) => {
                alert(err.responseText);
            }
        });
    }
};

// admin update bloggers pass
function passUpdater(ID) {
    $.ajax({
        type: "PUT",
        url: `/api/user/adminUpdater`,
        data: {id: ID},
        success: function (bloggerPassUpdate) {
            alert(bloggerPassUpdate);
            location.reload();
        },
        error: function (err) {
            alert(err.responseText);
        }
    });
}