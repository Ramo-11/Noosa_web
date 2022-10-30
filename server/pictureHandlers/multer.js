const multer = require("multer")
const path = require("path")
const { getLoggerType } = require("../../utils/loggers/loggerType")
projectLogger = getLoggerType("project")

module.exports = multer({
    storage: multer.diskStorage({}),
    fileFilter: (req, file, cb) => {
        let ext = path.extname(file.originalname)
        if (ext !== ".jpg" && ext !== ".jpeg" && ext !== ".png" && ext !== ".JPG" && ext !== ".JPEG" && ext !== ".PNG") {
            project.error("Unable to create project")
            project.debug("file type is not supported")
            cb(new Error("Picture type is not supported"), false)
            return
        }
        cb(null, true)
    }
})
