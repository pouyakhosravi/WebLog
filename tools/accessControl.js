const ACCESS_CONTROL = {};

// check if user be admin cant send message
ACCESS_CONTROL.messageAccess = function (req, res, next) {
    if(req.session.user)
    {
        if(req.session.user.role === "admin")
        {
            return res.status(400).send("شما ادمین هستید نمیتواید پیامی ارسال کنید.");
        }
    }
    next();
};

ACCESS_CONTROL.checkAdmin = function (req, res, next) {
    if(req.session.user.role !== "admin")
    {
        res.status(400).send("شما به این صفحه دسترسی ندارید.");
    }
    next();
}

module.exports = ACCESS_CONTROL;