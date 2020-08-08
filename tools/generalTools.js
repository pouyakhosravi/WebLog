const multer = require("multer");

const GENERAL_TOOLS = {};

GENERAL_TOOLS.storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/Avatars");
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    }
});

GENERAL_TOOLS.uploadAvatar = multer({storage: GENERAL_TOOLS.storage});

module.exports = GENERAL_TOOLS;